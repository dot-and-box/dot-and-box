import {ActionBase} from "./actionBase.ts";
import {Control} from "../dot/dotControl.ts";
import {StepState} from "./step.ts";

export class Clone extends ActionBase {
    left: Control
    right: Control | undefined
    leftControlId: string
    rightControlId: string
    isAdded: boolean

    constructor(leftControlId: string, rightControlId: string) {
        super()
        this.isAdded = false;
        this.leftControlId = leftControlId;
        this.rightControlId = rightControlId;
    }

    override onBeforeForward() {
        this.left = this.step.model.controls.find(c => c.id == this.leftControlId)
        if (this.step && !this.isAdded && this.step.state == StepState.START) {
            this.right = this.left.clone()
            this.right.id = this.rightControlId
            this.step.model.controls.push(this.right);
            this.isAdded = true
        }
    }

    override onBeforeBackward() {
        super.onBeforeBackward();
        const index = this.step.model.controls.indexOf(this.right!);
        if (index > -1) {
            this.step.model.controls.splice(index, 1);
            this.isAdded = false
        }
    }

}
