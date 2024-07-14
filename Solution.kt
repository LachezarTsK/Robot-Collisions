
import java.util.ArrayDeque

class Solution {

    private companion object {
        const val LEFT = 'L'
        const val RIGHT = 'R'
    }

    private var numberOfRobots: Int = 0
    private data class Robot(val inputIndex: Int, val position: Int, var health: Int, val direction: Char) {}

    fun survivedRobotsHealths(positions: IntArray, healths: IntArray, directions: String): List<Int> {
        numberOfRobots = positions.size
        val robots = createArrayRobotsSortedByPosition(positions, healths, directions)
        val survivedRobots = findAllSurvivedRobots(robots)
        return createListSurvivedRobotsHealthSortedByPosition(survivedRobots)
    }

    private fun findAllSurvivedRobots(robots: List<Robot>): ArrayDeque<Robot> {
        val survivedRobots = ArrayDeque<Robot>()

        for (i in robots.indices) {

            val current = robots[i]
            if (noCollision(current, survivedRobots)) {
                survivedRobots.push(current)
                continue
            }
            if (collisionWherePreviousRobotSurvives(current, survivedRobots)) {
                --survivedRobots.peek().health
                continue
            }
            while (collisionWherePreviousRobotDoesNotSurvive(current, survivedRobots)) {
                val previous = survivedRobots.pop()
                current.health = if (previous.health == current.health) 0 else current.health - 1
            }
            if (currentSurvivesAllCollisions(current, survivedRobots)) {
                survivedRobots.push(current)
                continue
            }
            if (previousDoesNotSurviveLastCollision(current, survivedRobots)) {
                survivedRobots.pop()
            }
        }
        return survivedRobots
    }

    private fun noCollision(current: Robot, survivedRobots: ArrayDeque<Robot>): Boolean {
        return current.direction == RIGHT
                || (!survivedRobots.isEmpty() && survivedRobots.peek().direction == LEFT)
    }

    private fun collisionWherePreviousRobotSurvives(current: Robot, survivedRobots: ArrayDeque<Robot>): Boolean {
        return !survivedRobots.isEmpty()
                && survivedRobots.peek().direction == RIGHT
                && survivedRobots.peek().health > current.health
    }

    private fun collisionWherePreviousRobotDoesNotSurvive(current: Robot, survivedRobots: ArrayDeque<Robot>): Boolean {
        return !survivedRobots.isEmpty()
                && survivedRobots.peek().direction == RIGHT
                && current.health > 0 && survivedRobots.peek().health <= current.health
    }

    private fun currentSurvivesAllCollisions(current: Robot, survivedRobots: ArrayDeque<Robot>): Boolean {
        return current.health > 0 && (survivedRobots.isEmpty() || survivedRobots.peek().direction == LEFT)
    }

    private fun previousDoesNotSurviveLastCollision(current: Robot, survivedRobots: ArrayDeque<Robot>): Boolean {
        if (!survivedRobots.isEmpty() && current.health > 0) {
            --survivedRobots.peek().health
        }
        return !survivedRobots.isEmpty() && survivedRobots.peek().health == 0
    }

    private fun createListSurvivedRobotsHealthSortedByPosition(survivedRobots: ArrayDeque<Robot>): List<Int> {
        val healths = IntArray(numberOfRobots)
        for (robot in survivedRobots) {
            healths[robot.inputIndex] = robot.health
        }

        val survivedRobotsHealth = ArrayList<Int>(survivedRobots.size)
        for (i in 0..<numberOfRobots) {
            if (healths[i] > 0) {
                survivedRobotsHealth.add(healths[i])
            }
        }
        return survivedRobotsHealth
    }

    private fun createArrayRobotsSortedByPosition(positions: IntArray, healths: IntArray, directions: String): List<Robot> {
        var robots = ArrayList<Robot>(numberOfRobots)
        for (i in 0..<numberOfRobots) {
            robots.add(Robot(i, positions[i], healths[i], directions[i]))
        }
        robots.sortWith() { x, y -> x.position - y.position }
        return robots
    }
}
