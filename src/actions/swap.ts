import {ActionBase} from "../shared/actionBase.ts"
import {Point} from "../shared/point.ts"
import {Step} from "../shared/step.ts"
import {Control} from "../controls/control.ts"
import {DummyControl} from "../controls/dummy/dummyControl.ts"

export class Swap extends ActionBase {
    left: Control = new DummyControl()
    right: Control = new DummyControl()
    start: Point
    end: Point
    leftControlId: string
    rightControlId: string

    constructor(step: Step, left: string, right: string) {
        super(step)
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
        const foundLeft = this.step.controls.find(c => c.id == this.leftControlId)
        if (foundLeft) {
            this.left = foundLeft
        }
        const foundRight = this.step.controls.find(c => c.id == this.rightControlId)
        if (foundRight) {
            this.right = foundRight
        }
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
