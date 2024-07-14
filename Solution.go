
package main

import (
    "fmt"
    "sort"
)

const LEFT = 'L'
const RIGHT = 'R'

var numberOfRobots int

func survivedRobotsHealths(positions []int, healths []int, directions string) []int {
    numberOfRobots = len(positions)
    robots := createArrayRobotsSortedByPosition(positions, healths, directions)
    survivedRobots := findAllSurvivedRobots(robots)
    return createListSurvivedRobotsHealthSortedByPosition(survivedRobots)
}

func findAllSurvivedRobots(robots []Robot) []Robot {
    survivedRobots := []Robot{}

    for i := range robots {

        current := robots[i]
        if noCollision(&current, survivedRobots) {
             survivedRobots = append(survivedRobots, current)
             continue
        }
        if collisionWherePreviousRobotSurvives(&current, survivedRobots) {
             survivedRobots[len(survivedRobots) - 1].health--
             continue
        }
        for collisionWherePreviousRobotDoesNotSurvive(&current, survivedRobots) {
             previous := survivedRobots[len(survivedRobots) - 1]
             survivedRobots = survivedRobots[:len(survivedRobots) - 1]
             current.health = Ternary(previous.health == current.health, 0, current.health - 1)
        }
        if currentSurvivesAllCollisions(&current, survivedRobots) {
             survivedRobots = append(survivedRobots, current)
             continue
        }
        if previousDoesNotSurviveLastCollision(&current, survivedRobots) {
             survivedRobots = survivedRobots[:len(survivedRobots) - 1]
        }
    }
    return survivedRobots
}

func noCollision(current *Robot, survivedRobots []Robot) bool {
    return current.direction == RIGHT ||
           (len(survivedRobots) > 0 && survivedRobots[len(survivedRobots) - 1].direction == LEFT)
}

func collisionWherePreviousRobotSurvives(current *Robot, survivedRobots []Robot) bool {
    return len(survivedRobots) > 0 &&
           survivedRobots[len(survivedRobots) - 1].direction == RIGHT &&
           survivedRobots[len(survivedRobots) - 1].health > current.health
}

func collisionWherePreviousRobotDoesNotSurvive(current *Robot, survivedRobots []Robot) bool {
    return len(survivedRobots) > 0 &&
           survivedRobots[len(survivedRobots) - 1].direction == RIGHT &&
           current.health > 0 &&
           survivedRobots[len(survivedRobots) - 1].health <= current.health
}

func currentSurvivesAllCollisions(current *Robot, survivedRobots []Robot) bool {
    return current.health > 0 && 
           (len(survivedRobots) == 0 || survivedRobots[len(survivedRobots) - 1].direction == LEFT)
}

func previousDoesNotSurviveLastCollision(current *Robot, survivedRobots []Robot) bool {
    if len(survivedRobots) > 0 && current.health > 0 {
        survivedRobots[len(survivedRobots) - 1].health--
    }
    return len(survivedRobots) > 0 && survivedRobots[len(survivedRobots) - 1].health == 0
}

func createListSurvivedRobotsHealthSortedByPosition(survivedRobots []Robot) []int {
    healths := make([]int, numberOfRobots)
    for _, robot := range survivedRobots {
        healths[robot.inputIndex] = robot.health
    }

    index:=0
    survivedRobotsHealth := make([]int, len(survivedRobots))
    for i := range healths {
        if healths[i] > 0 {
            survivedRobotsHealth[index] = healths[i]
            index++
        }
    }
    return survivedRobotsHealth
}

func createArrayRobotsSortedByPosition(positions []int, healths []int, directions string) []Robot {
    robots := make([]Robot, numberOfRobots)
    for i := range numberOfRobots {
        robots = append(robots, Robot{i, positions[i], healths[i], directions[i]})
    }
    sort.Slice(robots, func(x int, y int) bool { return robots[x].position < robots[y].position })
    return robots
}

type Robot struct {
    inputIndex int
    position   int
    health     int
    direction  byte
}

func Ternary[T any](condition bool, first T, second T) T {
    if condition {
        return first
    }
    return second
}
