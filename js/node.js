
class Node {
    constructor(nodeName,parentList) {
        this.name = nodeName;

        this.parents = parentList;
        this.parentNode = null;

        this.level=-1;
        this.position=-1;
        this.x;
        this.y;
    }

    setLevelandPosition(currLevel, positions) {
        //level
        this.level = currLevel;

        //positions
        this.position = positions[currLevel] + 1;
        positions[currLevel] = positions[currLevel] + 1;
    }

    setSpatialPosition(x, y) {
        this.x = x;
        this.y = y;
    }

}