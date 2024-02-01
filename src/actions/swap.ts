import {ActionBase} from "../shared/actionBase.ts"
import {Point} from "../shared/point.ts"
import {DotsAndBoxesModel} from "../shared/step.ts"
import {Control, DUMMY_CONTROL} from "../controls/control.ts"

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
            this.right.position.x = this.end.x - dx
            this.right.position.y = this.end.y - dy
            this.left.position.x = this.start.x + dx
            this.left.position.y = this.start.y + dy
        }

    }

}
