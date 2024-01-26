import {ActionBase} from "../shared/actionBase.ts";
import {Point} from "../shared/point.ts";
import {Step} from "../shared/step.ts";
import {Control} from "../controls/control.ts";
import {DummyControl} from "../controls/dummy/dummyControl.ts";
import {Sign} from "../shared/sign.ts";

export class Move extends ActionBase {
    start: Point;
    to: Point
    end: Point
    control: Control = new DummyControl()
    leftId: string

    constructor(step: Step, leftId: string, to: Point) {
        super(step)
        this.start = Point.zero()
        this.to = to;
        this.end = to;
        this.leftId = leftId;
    }

    //TODO: refactor onInit and onBeforeStep to support moving cloned controls
    override init() {
        super.init();
        const foundControl = this.step.controls.find(c => c.id == this.leftId)
        if (foundControl) {
            this.control = foundControl
            this.start = this.control.position.clone();
            this.end = this.calculateEnd(this.start, this.to)
        }
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
            this.control!.position.x = this.start.x
            this.control!.position.y = this.start.y
        } else if (progress == 1) {
            this.control!.position.x = this.end.x
            this.control!.position.y = this.end.y
        } else {
            this.control!.position.x = this.start.x + (this.end.x - this.start.x) * progress
            this.control!.position.y = this.start.y + (this.end.y - this.start.y) * progress
        }
    }

}
