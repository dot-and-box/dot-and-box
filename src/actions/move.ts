import {ActionBase} from "../shared/actionBase.ts"
import {Point} from "../shared/point.ts"
import {DotsAndBoxesModel} from "../shared/step.ts"
import {Control, DUMMY_CONTROL} from "../controls/control.ts"
import {Sign} from "../shared/sign.ts"

export class Move extends ActionBase {
    start: Point
    to: Point
    end: Point
    left: Control = DUMMY_CONTROL
    right: Control = DUMMY_CONTROL
    leftId: string
    rightId: string = ''

    constructor(model: DotsAndBoxesModel, leftId: string, to: Point, rightId = '') {
        super(model)
        this.start = Point.zero()
        this.to = to
        this.end = to
        this.leftId = leftId
        this.rightId = rightId
    }

    override init() {
        super.init()
        this.selectControls()
    }

    selectControls() {
        const foundControl = this.model.findControl(this.leftId)
        if (foundControl) {
            this.left = foundControl
            this.start = this.left.position.clone()
            this.end = this.calculateEnd(this.start, this.to)
        } else {
            this.left = DUMMY_CONTROL
        }

        if (this.rightId !== '') {
            const foundRight = this.model.findControl(this.rightId)
            if (foundRight) {
                this.right = foundRight
                this.end = this.right.position.clone()
            }
        }
    }

    override onBeforeForward() {
        super.onBeforeForward()
        this.selectControls()
    }

    calculateEnd(position: Point, change: Point) {
        if (change.sign == Sign.NONE) {
            return new Point(change.x, change.y)
        } else if (change.sign == Sign.PLUS) {
            return new Point(position.x + change.x, position.y + change.y)
        } else {
            return new Point(position.x - change.x, position.y - change.y)
        }
    }

    override updateValue(progress: number) {
        if (progress == 0) {
            this.left!.position.x = this.start.x
            this.left!.position.y = this.start.y
        } else if (progress == 1) {
            this.left!.position.x = this.end.x
            this.left!.position.y = this.end.y
        } else {
            this.left!.position.x = this.start.x + (this.end.x - this.start.x) * progress
            this.left!.position.y = this.start.y + (this.end.y - this.start.y) * progress
        }
    }

}
