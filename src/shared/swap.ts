import {ActionBase} from "./actionBase.ts";
import {Control} from "../dot/dotControl.ts";
import {Point} from "./point.ts";
import {StepState} from "./step.ts";

export class Swap extends ActionBase {
    left: Control
    right: Control
    start: Point;
    end: Point
    leftControlId: string
    rightControlId: string


    constructor(left: string, right: string) {
        super()
        this.start = Point.zero()
        this.end = Point.zero()
        this.leftControlId = left;
        this.rightControlId = right;
    }

    override onBeforeForward() {
        super.onBeforeForward();
        if (this.step.state == StepState.START) {
            this.left = this.step.model.controls.find(c => c.id == this.leftControlId)
            this.right = this.step.model.controls.find(c => c.id == this.rightControlId)

            this.start = this.left.position.clone();
            this.end = this.right.position.clone();
        }
    }

    override updateValue(progress: number) {
        if (progress == 0) {
            this.left.position.x = this.start.x
            this.left.position.y = this.start.y
            this.right.position.x = this.end.x
            this.right.position.y = this.end.y
        } else if (progress == 1) {
            this.left.position.x = this.end.x
            this.left.position.y = this.end.y
            this.right.position.x = this.start.x
            this.right.position.y = this.start.y
        } else {
            const dx = (this.end.x - this.start.x) * progress
            const dy = (this.end.y - this.start.y) * progress
            this.right.position.x = this.end.x - dx;
            this.right.position.y = this.end.y - dy;
            this.left.position.x = this.start.x + dx
            this.left.position.y = this.start.y + dy
        }

    }

}
