
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.List;

public class Solution {

    private static final char LEFT = 'L';
    private static final char RIGHT = 'R';
    private int numberOfRobots;

    public List<Integer> survivedRobotsHealths(int[] positions, int[] healths, String directions) {
        numberOfRobots = positions.length;
        Robot[] robots = createArrayRobotsSortedByPosition(positions, healths, directions);
        Deque<Robot> survivedRobots = findAllSurvivedRobots(robots);
        return createListSurvivedRobotsHealthSortedByPosition(survivedRobots);
    }

    private Deque<Robot> findAllSurvivedRobots(Robot[] robots) {
        Deque<Robot> survivedRobots = new ArrayDeque<>();

        for (int i = 0; i < robots.length; ++i) {

            Robot current = robots[i];
            if (noCollision(current, survivedRobots)) {
                survivedRobots.push(current);
                continue;
            }
            if (collisionWherePreviousRobotSurvives(current, survivedRobots)) {
                --survivedRobots.peek().health;
                continue;
            }
            while (collisionWherePreviousRobotDoesNotSurvive(current, survivedRobots)) {
                Robot previous = survivedRobots.pop();
                current.health = (previous.health == current.health) ? 0 : current.health - 1;
            }
            if (currentSurvivesAllCollisions(current, survivedRobots)) {
                survivedRobots.push(current);
                continue;
            }
            if (previousDoesNotSurviveLastCollision(current, survivedRobots)) {
                survivedRobots.pop();
            }
        }
        return survivedRobots;
    }

    private boolean noCollision(Robot current, Deque<Robot> survivedRobots) {
        return current.direction == RIGHT
                || (!survivedRobots.isEmpty() && survivedRobots.peek().direction == LEFT);
    }

    private boolean collisionWherePreviousRobotSurvives(Robot current, Deque<Robot> survivedRobots) {
        return !survivedRobots.isEmpty()
                && survivedRobots.peek().direction == RIGHT
                && survivedRobots.peek().health > current.health;
    }

    private boolean collisionWherePreviousRobotDoesNotSurvive(Robot current, Deque<Robot> survivedRobots) {
        return !survivedRobots.isEmpty()
                && survivedRobots.peek().direction == RIGHT
                && current.health > 0 && survivedRobots.peek().health <= current.health;
    }

    private boolean currentSurvivesAllCollisions(Robot current, Deque<Robot> survivedRobots) {
        return current.health > 0 && (survivedRobots.isEmpty() || survivedRobots.peek().direction == LEFT);
    }

    private boolean previousDoesNotSurviveLastCollision(Robot current, Deque<Robot> survivedRobots) {
        if (!survivedRobots.isEmpty() && current.health > 0) {
            --survivedRobots.peek().health;
        }
        return !survivedRobots.isEmpty() && survivedRobots.peek().health == 0;
    }

    private List<Integer> createListSurvivedRobotsHealthSortedByPosition(Deque<Robot> survivedRobots) {
        int[] healths = new int[numberOfRobots];
        for (Robot robot : survivedRobots) {
            healths[robot.inputIndex] = robot.health;
        }

        List<Integer> survivedRobotsHealth = new ArrayList<>(survivedRobots.size());
        for (int i = 0; i < numberOfRobots; ++i) {
            if (healths[i] > 0) {
                survivedRobotsHealth.add(healths[i]);
            }
        }
        return survivedRobotsHealth;
    }

    private Robot[] createArrayRobotsSortedByPosition(int[] positions, int[] healths, String directions) {
        Robot[] robots = new Robot[numberOfRobots];
        for (int i = 0; i < numberOfRobots; ++i) {
            robots[i] = new Robot(i, positions[i], healths[i], directions.charAt(i));
        }
        Arrays.sort(robots, (x, y) -> x.position - y.position);
        return robots;
    }
}

class Robot {

    int inputIndex;
    int position;
    int health;
    char direction;

    Robot(int inputIndex, int position, int health, char direction) {
        this.inputIndex = inputIndex;
        this.position = position;
        this.health = health;
        this.direction = direction;
    }
}
