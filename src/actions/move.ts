import {ActionBase} from "../shared/actionBase.ts";
import {Point} from "../shared/point.ts";
import {Step, StepState} from "../shared/step.ts";
import {Control} from "../controls/control.ts";
import {DummyControl} from "../controls/dummy/dummyControl.ts";

export class Move extends ActionBase {
    start: Point;
    end: Point
    control: Control = new DummyControl()
    leftId: string

    constructor(step: Step, leftId: string, end: Point) {
        super(step)
        this.start = Point.zero()
        this.end = end.clone();
        this.leftId = leftId;
    }

    override onBeforeForward() {
        super.onBeforeForward();
        if (this.step.state == StepState.START) {
            const foundControl = this.step.model.controls.find(c => c.id == this.leftId)
            if (foundControl) {
                this.control = foundControl
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
