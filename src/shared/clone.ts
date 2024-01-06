import {ActionBase} from "./actionBase.ts";
import {Control} from "../dot/dotControl.ts";

export class Clone extends ActionBase {
    left: Control
    right: Control | undefined
    identifier: String
    isAdded: boolean

    constructor(left: Control, identifier: String) {
        super()
        this.isAdded = false;
        this.left = left;
        this.identifier = identifier;
    }

    override onBeforeForward() {
        if (!this.isAdded && this.step) {
            this.right = this.left.clone()
            this.right.id = this.identifier
            this.step.model.controls.push(this.right);
            this.isAdded = true
        }
    }

    override onBeforeBackward() {
        super.onBeforeBackward();
        const index = this.step.model.controls.indexOf(this.right!);
        if (index > -1) {
            this.step.model.controls.splice(index, 1);
            this.right = undefined
            this.isAdded = false
        }
    }

}
