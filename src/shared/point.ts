import {Sign} from "./sign.ts"

export class Point {
    public x: number
    public y: number
    public sign: Sign

    constructor(x: number, y: number, sign: Sign = Sign.NONE) {
        this.x = x
        this.y = y
        this.sign = sign
    }

    clone(): Point {
        return new Point(this.x, this.y, this.sign)
    }

    static zero = (): Point => new Point(0, 0)
}
