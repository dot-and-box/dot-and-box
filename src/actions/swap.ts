import {ActionBase} from "../shared/actionBase.ts"
import {Point} from "../shared/point.ts"
import {DotsAndBoxesModel} from "../shared/step.ts"
import {Control} from "../controls/control.ts"
import {DUMMY_CONTROL} from "../shared/constants.ts";

export class Swap extends ActionBase {
    left: Control = DUMMY_CONTROL
    right: Control = DUMMY_CONTROL
    start: Point
    end: Point
    leftControlId: string
    rightControlId: string

    constructor(model: DotsAndBoxesModel, left: string, right: string) {
        super(model)
        this.start = Point.zero()
        this.end = Point.zero()
        this.leftControlId = left
        this.rightControlId = right
    }

    override init() {
        super.init()
        this.selectControls()
    }

    override onBeforeForward() {
        super.onBeforeForward()
        this.selectControls()
    }

    selectControls() {
        const foundLeft = this.model.findControl(this.leftControlId)
        this.left = foundLeft
            ? foundLeft
            : DUMMY_CONTROL

        const foundRight = this.model.findControl(this.rightControlId)
        this.right = foundRight
            ? foundRight
            : DUMMY_CONTROL

        this.start = this.left.position.clone()
        this.end = this.right.position.clone()
    }

    override updateValue(progress: number) {
        if (progress == 0) {
            this.left.updatePosition(this.start.x, this.start.y)
            this.right.updatePosition(this.end.x, this.end.y)
        } else if (progress == 1) {
            this.left.updatePosition(this.end.x, this.end.y)
            this.right.updatePosition(this.start.x, this.start.y)
        } else {
            const dx = (this.end.x - this.start.x) * progress
            const dy = (this.end.y - this.start.y) * progress
            this.left.updatePosition(this.start.x + dx, this.start.y + dy)
            this.right.updatePosition(this.end.x - dx, this.end.y - dy)
        }

    }

}
