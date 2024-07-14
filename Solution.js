
/**
 * @param {number[]} positions
 * @param {number[]} healths
 * @param {string} directions
 * @return {number[]}
 */
var survivedRobotsHealths = function (positions, healths, directions) {
    this.LEFT = 'L';
    this.RIGHT = 'R';
    this.numberOfRobots = positions.length;
    const robots = createArrayRobotsSortedByPosition(positions, healths, directions);
    const survivedRobots = findAllSurvivedRobots(robots);
    return createListSurvivedRobotsHealthSortedByPosition(survivedRobots);
};

/**
 * @param {Robot[]} robots
 * @return {Robot[]}
 */
function findAllSurvivedRobots(robots) {
    const survivedRobots = new Array();

    for (let i = 0; i < robots.length; ++i) {

        const current = robots[i];
        if (noCollision(current, survivedRobots)) {
            survivedRobots.push(current);
            continue;
        }
        if (collisionWherePreviousRobotSurvives(current, survivedRobots)) {
            --survivedRobots[survivedRobots.length - 1].health;
            continue;
        }
        while (collisionWherePreviousRobotDoesNotSurvive(current, survivedRobots)) {
            const previous = survivedRobots.pop();
            current.health = (previous.health === current.health) ? 0 : current.health - 1;
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

/**
 * @param {Robot} current 
 * @param {Robot[]} survivedRobots
 * @return {boolean}
 */
function noCollision(current, survivedRobots) {
    return current.direction === this.RIGHT
            || (survivedRobots.length > 0 && survivedRobots[survivedRobots.length - 1].direction === this.LEFT);
}

/**
 * @param {Robot} current 
 * @param {Robot[]} survivedRobots
 * @return {boolean}
 */
function collisionWherePreviousRobotSurvives(current, survivedRobots) {
    return survivedRobots.length > 0
            && survivedRobots[survivedRobots.length - 1].direction === this.RIGHT
            && survivedRobots[survivedRobots.length - 1].health > current.health;
}

/**
 * @param {Robot} current 
 * @param {Robot[]} survivedRobots
 * @return {boolean}
 */
function collisionWherePreviousRobotDoesNotSurvive(current, survivedRobots) {
    return survivedRobots.length > 0
            && survivedRobots[survivedRobots.length - 1].direction === this.RIGHT
            && current.health > 0 && survivedRobots[survivedRobots.length - 1].health <= current.health;
}

/**
 * @param {Robot} current 
 * @param {Robot[]} survivedRobots
 * @return {boolean}
 */
function currentSurvivesAllCollisions(current, survivedRobots) {
    return current.health > 0
            && (survivedRobots.length === 0 || survivedRobots[survivedRobots.length - 1].direction === this.LEFT);
}

/**
 * @param {Robot} current 
 * @param {Robot[]} survivedRobots
 * @return {boolean}
 */
function previousDoesNotSurviveLastCollision(current, survivedRobots) {
    if (survivedRobots.length > 0 && current.health > 0) {
        --survivedRobots[survivedRobots.length - 1].health;
    }
    return survivedRobots.length > 0 && survivedRobots[survivedRobots.length - 1].health === 0;
}

/**
 * @param {Robot[]} survivedRobots
 * @return {number[]}
 */
function createListSurvivedRobotsHealthSortedByPosition(survivedRobots) {
    const healths = new Array(this.numberOfRobots).fill(0);
    for (let robot of survivedRobots) {
        healths[robot.inputIndex] = robot.health;
    }

    let index = 0;
    const survivedRobotsHealth = new Array(survivedRobots.length);
    for (let i = 0; i < this.numberOfRobots; ++i) {
        if (healths[i] > 0) {
            survivedRobotsHealth[index] = healths[i];
            ++index;
        }
    }
    return survivedRobotsHealth;
}

/**
 * @param {number[]} positions
 * @param {number[]} healths
 * @param {string} directions
 * @return {Robot[]}
 */
function createArrayRobotsSortedByPosition(positions, healths, directions) {
    const robots = new Array(this.numberOfRobots);
    for (let i = 0; i < this.numberOfRobots; ++i) {
        robots[i] = new Robot(i, positions[i], healths[i], directions.charAt(i));
    }
    robots.sort((x, y) => x.position - y.position);
    return robots;
}

/**
 * @param {number} inputIndex
 * @param {number} position
 * @param {number} health
 * @param {string} direction
 */
function Robot(inputIndex, position, health, direction) {
    this.inputIndex = inputIndex;
    this.position = position;
    this.health = health;
    this.direction = direction;
}
