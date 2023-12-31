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
        const dx = x - this.left.position.x
        const dy = y - this.left.position.y

        this.left.position.x = x;
        this.left.position.y = y;

        this.right.position.x -= dx
        this.right.position.y -= dy
    }

}
