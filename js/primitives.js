class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    //static method to create a Point from x and y
    static from(x, y) {
        return new Point(x, y)
    }

}

class BoundingBox {

    /**
     * @param {Point} pos
     * @param {Point} size
     */
    constructor(pos, size) {
        this.position = pos;
        this.size = size;
    }

    /**
     *
     * @param {Point} pos
     * @param {Point} size
     */
    static from(pos, size) {
        return new BoundingBox(pos, size);
    }

    static fromCoords(x, y, width, height) {
        return BoundingBox.from(
            Point.from(x, y),
            Point.from(width, height)
        );
    }
}