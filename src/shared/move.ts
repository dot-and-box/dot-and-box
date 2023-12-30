import {ActionBase} from "./actionBase.ts";
import {Point} from "./point.ts";
import {Control} from "../dot/dotControl.ts";

export class Move extends ActionBase {

    control: Control

    constructor(end: Point, control: Control) {
        super()
        this.start = control.position.clone();
        this.end = end.clone();
        this.control = control;
    }

    override updateValue(x: number, y: number){
        this.control.position.x = x;
        this.control.position.y = y;
    }

    override onBeforeStateForward() {
        this.start = this.control.position.clone()
    }

}
