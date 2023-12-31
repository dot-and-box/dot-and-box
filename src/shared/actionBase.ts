import {Point} from "./point.ts";

export abstract class ActionBase {
    finished: boolean = false
    progress: number = 0
    start: Point;
    end: Point
    value: Point

    protected constructor() {
        this.start = Point.zero()
        this.end = Point.zero()
        this.value = Point.zero()
    }

    abstract updateValue(x: number, y: number): void;


}