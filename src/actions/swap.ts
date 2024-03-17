import {ActionBase} from "../shared/actionBase.ts"
import {Point} from "../shared/point.ts"
import {Control} from "../controls/control.ts"
import {DUMMY_CONTROL} from "../shared/constants.ts";
import {DotAndBoxModel} from "../shared/dotAndBoxModel.ts";

export class Swap extends ActionBase {
    left: Control = DUMMY_CONTROL
    right: Control = DUMMY_CONTROL
    startLeft: Point
    startRight: Point
    endLeft: Point
    endRight: Point
    leftControlId: string
    rightControlId: string

    constructor(model: DotAndBoxModel, left: string, right: string) {
        super(model)
        this.startLeft = Point.zero()
        this.endLeft = Point.zero()
        this.startRight = Point.zero()
        this.endRight = Point.zero()
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

        this.startLeft = this.left.position.clone()
        this.endLeft = this.left.targetByCenter(this.right.center).clone()
        this.startRight = this.right.position.clone()
        this.endRight = this.right.targetByCenter(this.left.center).clone()
    }

    override updateValue(progress: number) {
        if (progress == 0) {
            this.left.updatePosition(this.startLeft.x, this.startLeft.y)
            this.right.updatePosition(this.startRight.x, this.startRight.y)
        } else if (progress == 1) {
            this.left.updatePosition(this.endLeft.x, this.endLeft.y)
            this.right.updatePosition(this.endRight.x, this.endRight.y)
        } else {
            const dxl = (this.endLeft.x - this.startLeft.x) * progress
            const dyl = (this.endLeft.y - this.startLeft.y) * progress
            this.left.updatePosition(this.startLeft.x + dxl, this.startLeft.y + dyl)

            const dxr = (this.endRight.x - this.startRight.x) * progress
            const dyr = (this.endRight.y - this.startRight.y) * progress
             this.right.updatePosition(this.startRight.x + dxr, this.startRight.y + dyr)
        }

    }

}
