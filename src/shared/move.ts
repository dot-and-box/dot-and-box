import {ActionBase} from "./actionBase.ts";
import {Point} from "./point.ts";
import {Control} from "../dot/dotControl.ts";
import {StepState} from "./step.ts";

export class Move extends ActionBase {
    start: Point;
    end: Point
    control: Control | undefined
    leftId: string

    constructor(leftId: string, end: Point) {
        super()
        this.start = Point.zero()
        this.end = end.clone();
        this.leftId = leftId;
    }

    override onBeforeForward() {
        super.onBeforeForward();
        if (this.step.state == StepState.START) {
            this.control = this.step.model.controls.find(c => c.id == this.leftId)
            if (this.control) {
                this.start = this.control.position.clone();
            }
        }
    }

    override updateValue(progress: number) {
        if (progress == 0) {
            this.control!.position.x = this.start.x
            this.control!.position.y = this.start.y
        } else if (progress == 1) {
            this.control!.position.x = this.end.x
            this.control!.position.y = this.end.y
        } else {
            this.control!.position.x = this.start.x + (this.end.x - this.start.x) * progress
            this.control!.position.y = this.start.y + (this.end.y - this.start.y) * progress
        }
    }

}
