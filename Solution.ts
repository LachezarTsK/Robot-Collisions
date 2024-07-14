
function survivedRobotsHealths(positions: number[], healths: number[], directions: string): number[] {
    this.LEFT = 'L';
    this.RIGHT = 'R';
    this.numberOfRobots = positions.length;
    const robots = createArrayRobotsSortedByPosition(positions, healths, directions);
    const survivedRobots = findAllSurvivedRobots(robots);
    return createListSurvivedRobotsHealthSortedByPosition(survivedRobots);
};

function findAllSurvivedRobots(robots: Array<Robot>): Array<Robot> {
    const survivedRobots = new Array<Robot>();

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

function noCollision(current: Robot, survivedRobots: Array<Robot>): boolean {
    return current.direction === this.RIGHT
           || (survivedRobots.length > 0 && survivedRobots[survivedRobots.length - 1].direction === this.LEFT);
}

function collisionWherePreviousRobotSurvives(current: Robot, survivedRobots: Array<Robot>): boolean {
    return survivedRobots.length > 0
           && survivedRobots[survivedRobots.length - 1].direction === this.RIGHT
           && survivedRobots[survivedRobots.length - 1].health > current.health;
}

function collisionWherePreviousRobotDoesNotSurvive(current: Robot, survivedRobots: Array<Robot>): boolean {
    return survivedRobots.length > 0
           && survivedRobots[survivedRobots.length - 1].direction === this.RIGHT
           && current.health > 0 && survivedRobots[survivedRobots.length - 1].health <= current.health;
}

function currentSurvivesAllCollisions(current: Robot, survivedRobots: Array<Robot>): boolean {
    return current.health > 0
           && (survivedRobots.length === 0 || survivedRobots[survivedRobots.length - 1].direction === this.LEFT);
}

function previousDoesNotSurviveLastCollision(current: Robot, survivedRobots: Array<Robot>): boolean {
    if (survivedRobots.length > 0 && current.health > 0) {
        --survivedRobots[survivedRobots.length - 1].health;
    }
    return survivedRobots.length > 0 && survivedRobots[survivedRobots.length - 1].health === 0;
}

function createListSurvivedRobotsHealthSortedByPosition(survivedRobots: Array<Robot>): Array<number> {
    const healths = new Array<number>(this.numberOfRobots).fill(0);
    for (let robot of survivedRobots) {
        healths[robot.inputIndex] = robot.health;
    }

    let index = 0;
    const survivedRobotsHealth = new Array<number>(survivedRobots.length);
    for (let i = 0; i < this.numberOfRobots; ++i) {
        if (healths[i] > 0) {
            survivedRobotsHealth[index] = healths[i];
            ++index;
        }
    }
    return survivedRobotsHealth;
}

function createArrayRobotsSortedByPosition(positions: number[], healths: number[], directions: string): Array<Robot> {
    const robots = new Array<Robot>(this.numberOfRobots);
    for (let i = 0; i < this.numberOfRobots; ++i) {
        robots[i] = new Robot(i, positions[i], healths[i], directions.charAt(i));
    }
    robots.sort((x, y) => x.position - y.position);
    return robots;
}


class Robot {

    inputIndex: number;
    position: number;
    health: number;
    direction: string;

    constructor(inputIndex: number, position: number, health: number, direction: string) {
        this.inputIndex = inputIndex;
        this.position = position;
        this.health = health;
        this.direction = direction;
    }
}
