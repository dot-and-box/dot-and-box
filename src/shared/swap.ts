import {ActionBase} from "./actionBase.ts";
import {Control} from "../dot/dotControl.ts";

export class Swap extends ActionBase {
    left: Control
    right: Control

    constructor(left: Control, right: Control) {
        super()
        this.start = left.position.clone();
        this.end = right.position.clone();
        this.left = left;
        this.right = right;
    }

    override updateValue(x: number, y: number) {
        this.left.position.x = x;
        this.left.position.y = y;
        //TODO implement moving right to left
    }

    override onBeforeStateForward() {
        this.start = this.left.position.clone();
        this.end = this.right.position.clone();    }

}
