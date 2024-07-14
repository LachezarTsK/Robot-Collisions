
using System;
using System.Collections.Generic;

public class Solution
{
    private static readonly char LEFT = 'L';
    private static readonly char RIGHT = 'R';
    private int numberOfRobots;

    public IList<int> SurvivedRobotsHealths(int[] positions, int[] healths, string directions)
    {
        numberOfRobots = positions.Length;
        Robot[] robots = CreateArrayRobotsSortedByPosition(positions, healths, directions);
        Stack<Robot> survivedRobots = FindAllSurvivedRobots(robots);
        return CreateListSurvivedRobotsHealthSortedByPosition(survivedRobots);
    }

    private Stack<Robot> FindAllSurvivedRobots(Robot[] robots)
    {
        Stack<Robot> survivedRobots = new Stack<Robot>();

        for (int i = 0; i < robots.Length; ++i)
        {
            Robot current = robots[i];
            if (NoCollision(current, survivedRobots))
            {
                survivedRobots.Push(current);
                continue;
            }
            if (CollisionWherePreviousRobotSurvives(current, survivedRobots))
            {
                --survivedRobots.Peek().health;
                continue;
            }
            while (CollisionWherePreviousRobotDoesNotSurvive(current, survivedRobots))
            {
                Robot previous = survivedRobots.Pop();
                current.health = (previous.health == current.health) ? 0 : current.health - 1;
            }
            if (CurrentSurvivesAllCollisions(current, survivedRobots))
            {
                survivedRobots.Push(current);
                continue;
            }
            if (PreviousDoesNotSurviveLastCollision(current, survivedRobots))
            {
                survivedRobots.Pop();
            }
        }
        return survivedRobots;
    }

    private bool NoCollision(Robot current, Stack<Robot> survivedRobots)
    {
        return current.direction == RIGHT
                || (survivedRobots.Count > 0 && survivedRobots.Peek().direction == LEFT);
    }

    private bool CollisionWherePreviousRobotSurvives(Robot current, Stack<Robot> survivedRobots)
    {
        return survivedRobots.Count > 0
                && survivedRobots.Peek().direction == RIGHT
                && survivedRobots.Peek().health > current.health;
    }

    private bool CollisionWherePreviousRobotDoesNotSurvive(Robot current, Stack<Robot> survivedRobots)
    {
        return survivedRobots.Count > 0
                && survivedRobots.Peek().direction == RIGHT
                && current.health > 0 && survivedRobots.Peek().health <= current.health;
    }

    private bool CurrentSurvivesAllCollisions(Robot current, Stack<Robot> survivedRobots)
    {
        return current.health > 0 && (survivedRobots.Count == 0 || survivedRobots.Peek().direction == LEFT);
    }

    private bool PreviousDoesNotSurviveLastCollision(Robot current, Stack<Robot> survivedRobots)
    {
        if (survivedRobots.Count > 0 && current.health > 0)
        {
            --survivedRobots.Peek().health;
        }
        return survivedRobots.Count > 0 && survivedRobots.Peek().health == 0;
    }

    private IList<int> CreateListSurvivedRobotsHealthSortedByPosition(Stack<Robot> survivedRobots)
    {
        int[] healths = new int[numberOfRobots];
        foreach (Robot robot in survivedRobots)
        {
            healths[robot.inputIndex] = robot.health;
        }

        IList<int> survivedRobotsHealth = new List<int>(survivedRobots.Count);
        for (int i = 0; i < numberOfRobots; ++i)
        {
            if (healths[i] > 0)
            {
                survivedRobotsHealth.Add(healths[i]);
            }
        }
        return survivedRobotsHealth;
    }

    private Robot[] CreateArrayRobotsSortedByPosition(int[] positions, int[] healths, String directions)
    {
        Robot[] robots = new Robot[numberOfRobots];
        for (int i = 0; i < robots.Length; ++i)
        {
            robots[i] = new Robot(i, positions[i], healths[i], directions[i]);
        }
        Array.Sort(robots, (x, y) => x.position - y.position);
        return robots;
    }
}

class Robot
{
    public int inputIndex;
    public int position;
    public int health;
    public char direction;

    public Robot(int inputIndex, int position, int health, char direction)
    {
        this.inputIndex = inputIndex;
        this.position = position;
        this.health = health;
        this.direction = direction;
    }
}
