import {ActionBase} from "./actionBase.ts";
import {Point} from "./point.ts";
import {Control} from "../dot/dotControl.ts";

export class Move extends ActionBase {
    start: Point;
    end: Point
    control: Control

    constructor(end: Point, control: Control) {
        super()
        this.start = Point.zero()
        this.end = end.clone();
        this.control = control;
    }

    override onBeforeForward() {
        super.onBeforeForward();
        this.start = this.control.position.clone();
    }

    override updateValue(progress: number) {
        if (progress == 0) {
            this.control.position.x = this.start.x
            this.control.position.y = this.start.y
        } else if (progress == 1) {
            this.control.position.x = this.end.x
            this.control.position.y = this.end.y
        } else {
            this.control.position.x = this.start.x + (this.end.x - this.start.x) * progress
            this.control.position.y = this.start.y + (this.end.y - this.start.y) * progress
        }
    }

}
