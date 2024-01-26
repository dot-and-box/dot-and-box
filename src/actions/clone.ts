import {ActionBase} from "../shared/actionBase.ts";
import {Step} from "../shared/step.ts";
import {Control} from "../controls/control.ts";
import {DummyControl} from "../controls/dummy/dummyControl.ts";
import {StepState} from "../shared/stepState.ts";

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

    override init() {
        super.init()
        const foundLeft = this.step.controls.find(c => c.id == this.leftControlId)
        if (foundLeft) {
            this.left = foundLeft
        }
    }

    override onBeforeForward() {
        super.onBeforeForward();
        if (!this.isAdded && this.step.state == StepState.START) {
            this.right = this.left.clone()
            this.right.id = this.rightControlId
            this.step.controls.push(this.right);
            this.isAdded = true
        }
    }

    override onAfterBackward() {
        super.onAfterBackward();
        const index = this.step.controls.indexOf(this.right!);
        if (index > -1) {
            this.step.controls.splice(index, 1);
            this.isAdded = false
        }
    }

    // @ts-ignore
    updateValue(progress: number): void {
    }

}
