import {Point} from "./point.ts";

export abstract class ActionBase {
    finished: boolean = false
    progress: number = 0
    start: Point;
    end: Point
    value: Point

    updateValue(x: number, y: number){
    }

}