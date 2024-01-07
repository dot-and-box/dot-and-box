import {ActionBase} from "../shared/actionBase.ts";
import {Step, StepState} from "../shared/step.ts";
import {Control} from "../controls/control.ts";
import {DummyControl} from "../controls/dummy/dummyControl.ts";

export class Clone extends ActionBase {
    left: Control = new DummyControl()
    right: Control = new DummyControl()
    leftControlId: string
    rightControlId: string
    isAdded: boolean

    constructor(step: Step, leftControlId: string, rightControlId: string) {
        super(step)
        this.isAdded = false;
        this.leftControlId = leftControlId;
        this.rightControlId = rightControlId;
    }

    override onBeforeForward() {
        const foundLeft = this.step.model.controls.find(c => c.id == this.leftControlId)
        if (foundLeft) {
            this.left = foundLeft
        }
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

    // @ts-ignore
    updateValue(progress: number): void {
    }

}
