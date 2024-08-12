import {ActionBase} from "../shared/actionBase.ts"
import {Control} from "../controls/control.ts"
import {DUMMY_CONTROL} from "../shared/constants.ts";
import {DotAndBoxModel} from "../shared/dotAndBoxModel.ts";

export class Clone extends ActionBase {
    left: Control = DUMMY_CONTROL
    right: Control = DUMMY_CONTROL
    leftControlId: string
    rightControlId: string
    isAdded: boolean

    constructor(model: DotAndBoxModel, leftControlId: string, rightControlId: string) {
        super(model)
        this.isAdded = false
        this.leftControlId = leftControlId
        this.rightControlId = rightControlId
    }

    override init() {
        super.init()
        const foundLeft = this.model.findControl(this.leftControlId)
        if (foundLeft) {
            this.left = foundLeft
        } else {
            this.left = DUMMY_CONTROL
        }
    }

    cloneAndAddControl() {
        if (!this.isAdded) {
            this.right = this.left.clone()
            this.right.id = this.rightControlId
            this.model.controls.push(this.right)
            this.isAdded = true
        }
    }

    override onBeforeForward() {
        super.onBeforeForward()
        this.cloneAndAddControl()
    }

    override onAfterBackward() {
        super.onAfterBackward()
        this.destroyControls()
    }

    destroyControls() {
        if (this.isAdded) {
            const index = this.model.controls.indexOf(this.right!)
            if (index > -1) {
                this.model.controls.splice(index, 1)
                this.isAdded = false
            }
        }
    }

    // @ts-ignore
    override updateValue(progress: number) {
    }

}
