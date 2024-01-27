import {ActionBase} from "../shared/actionBase.ts"
import {Point} from "../shared/point.ts"
import {Step} from "../shared/step.ts"
import {Control} from "../controls/control.ts"
import {DummyControl} from "../controls/dummy/dummyControl.ts"

export class CameraMove extends ActionBase {
    start: Point
    to: Point
    end: Point
    control: Control = new DummyControl()
    leftId: string

    constructor(step: Step, to: Point) {
        super(step)
        this.start = Point.zero()
        this.to = to
        this.end = to
    }

    override init() {
        super.init()
    }

    override updateValue(progress: number) {
         this.step
    }

}
