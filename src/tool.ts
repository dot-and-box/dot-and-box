import {Point} from "./point.ts";

export abstract class Tool {
    abstract click(point: Point): void
    move(point: Point): void {
        console.log(point)
    }
    up(point: Point): void {
        console.log(point)
    }
}

