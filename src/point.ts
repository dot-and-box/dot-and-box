export class Point {
    public x: number
    public y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(point: Point): Point {
        return new Point(this.x + point.x, this.y + point.y)
    }

    clone(): Point {
        return new Point(this.x , this.y)
    }


    static zero = (): Point => new Point(0, 0)
}