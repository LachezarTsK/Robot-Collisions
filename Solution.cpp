
#include <span>
#include <deque>
#include <ranges>
#include <vector>
#include <string>
#include <string_view>
using namespace std;

struct Robot {

    size_t inputIndex{};
    int position{};
    int health{};
    char direction{};

    Robot() = default;
    Robot(size_t inputIndex, int position, int health, char direction) :
          inputIndex{ inputIndex }, position{ position }, health{ health }, direction{ direction } {}
};

class Solution {

    static const char LEFT = 'L';
    static const char RIGHT = 'R';
    size_t numberOfRobots = 0;

public:
    vector<int> survivedRobotsHealths(const vector<int>& positions, const vector<int>& healths, const string& directions) {
        this->numberOfRobots = positions.size();
        vector<Robot> robots = createArrayRobotsSortedByPosition(positions, healths, directions);
        deque<Robot> survivedRobots = findAllSurvivedRobots(robots);
        return createListSurvivedRobotsHealthSortedByPosition(survivedRobots);
    }

private:
    deque<Robot> findAllSurvivedRobots(span <const Robot> robots) const {
        deque<Robot> survivedRobots;

        for (size_t i = 0; i < robots.size(); ++i) {

            Robot current = robots[i];
            if (noCollision(current, survivedRobots)) {
                survivedRobots.push_back(current);
                continue;
            }
            if (collisionWherePreviousRobotSurvives(current, survivedRobots)) {
                --survivedRobots.back().health;
                continue;
            }
            while (collisionWherePreviousRobotDoesNotSurvive(current, survivedRobots)) {
                Robot previous = survivedRobots.back();
                survivedRobots.pop_back();
                current.health = (previous.health == current.health) ? 0 : current.health - 1;
            }
            if (currentSurvivesAllCollisions(current, survivedRobots)) {
                survivedRobots.push_back(current);
                continue;
            }
            if (previousDoesNotSurviveLastCollision(current, survivedRobots)) {
                survivedRobots.pop_back();
            }
        }
        return survivedRobots;
    }

    bool noCollision(const Robot& current, const deque<Robot>& survivedRobots) const {
        return current.direction == RIGHT
               || (!survivedRobots.empty() && survivedRobots.back().direction == LEFT);
    }

    bool collisionWherePreviousRobotSurvives(const Robot& current, const deque<Robot>& survivedRobots) const {
        return !survivedRobots.empty()
                && survivedRobots.back().direction == RIGHT
                && survivedRobots.back().health > current.health;
    }

    bool collisionWherePreviousRobotDoesNotSurvive(const Robot& current, const deque<Robot>& survivedRobots) const {
        return !survivedRobots.empty()
                && survivedRobots.back().direction == RIGHT
                && current.health > 0 && survivedRobots.back().health <= current.health;
    }

    bool currentSurvivesAllCollisions(const Robot& current, const deque<Robot>& survivedRobots) const {
        return current.health > 0 && (survivedRobots.empty() || survivedRobots.back().direction == LEFT);
    }

    bool previousDoesNotSurviveLastCollision(const Robot& current, deque<Robot>& survivedRobots) const {
        if (!survivedRobots.empty() && current.health > 0) {
            --survivedRobots.back().health;
        }
        return !survivedRobots.empty() && survivedRobots.back().health == 0;
    }

    vector<int> createListSurvivedRobotsHealthSortedByPosition(const deque<Robot>& survivedRobots) const {
        vector<int> healths(numberOfRobots);
        for (const auto& robot : survivedRobots) {
            healths[robot.inputIndex] = robot.health;
        }

        vector<int> survivedRobotsHealth;
        survivedRobotsHealth.reserve(survivedRobots.size());
        for (size_t i = 0; i < numberOfRobots; ++i) {
            if (healths[i] > 0) {
                survivedRobotsHealth.push_back(healths[i]);
            }			
        }
        return survivedRobotsHealth;
    }

    vector<Robot> createArrayRobotsSortedByPosition(span<const int> positions, span<const int> healths, string_view directions) const {
        vector<Robot> robots;
        robots.reserve(numberOfRobots);
        for (size_t i = 0; i < numberOfRobots; ++i) {
            robots.emplace_back(i, positions[i], healths[i], directions[i]);
        }
        ranges::sort(robots, [](const auto& x, const auto& y) { return x.position < y.position; });
        return robots;
    }
};
