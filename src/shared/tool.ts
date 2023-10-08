import {Point} from "./point.ts";

export abstract class Tool {
    abstract click(point: Point): void
    // @ts-ignore
    move(point: Point): void {
    }
    // @ts-ignore
    up(point: Point): void {
    }
}

