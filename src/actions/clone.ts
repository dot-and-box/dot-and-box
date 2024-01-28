import {ActionBase} from "../shared/actionBase.ts"
import {DotsAndBoxesModel} from "../shared/step.ts"
import {Control} from "../controls/control.ts"
import {DummyControl} from "../controls/dummy/dummyControl.ts"

export class Clone extends ActionBase {
    left: Control = new DummyControl()
    right: Control = new DummyControl()
    leftControlId: string
    rightControlId: string
    isAdded: boolean

    constructor(model: DotsAndBoxesModel, leftControlId: string, rightControlId: string) {
        super(model)
        this.isAdded = false
        this.leftControlId = leftControlId
        this.rightControlId = rightControlId
    }

    override init() {
        super.init()
        const foundLeft = this.model.controls.find(c => c.id == this.leftControlId)
        if (foundLeft) {
            this.left = foundLeft
            this.cloneAndAddControl()
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
