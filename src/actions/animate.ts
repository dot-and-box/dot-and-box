import { ActionBase } from "../shared/actionBase.ts"
import { Point } from "../shared/point.ts"
import { Control } from "../controls/control.ts"
import { Sign } from "../shared/sign.ts"
import { DUMMY_CONTROL } from "../shared/constants.ts";
import { DotAndBoxModel } from "../shared/dotAndBoxModel.ts";

export class Animate extends ActionBase {
    start: Point
    to: Point
    end: Point
    left: Control = DUMMY_CONTROL
    right: Control = DUMMY_CONTROL
    leftId: string
    rightId: string = ''
    propertyName: string = ''
    updateControlValue: (x: number, y: number) => void

    constructor(model: DotAndBoxModel, property: string, leftId: string, to: Point, rightId = '') {
        super(model)
        this.propertyName = property
        this.start = Point.zero()
        this.to = to
        this.end = to
        this.leftId = leftId
        this.rightId = rightId
        this.updateControlValue = () => { }
    }

    override init() {
        super.init()
        this.selectControls()
    }

    selectControls() {
        const foundControl = this.model.findControl(this.leftId)
        if (foundControl) {
            this.left = foundControl
            this.start = this.left.getPointPropertyValue(this.propertyName).clone()
            let controlTo = this.to.clone()
            foundControl.normalizePositionUnit(controlTo, this.model.cellSize)
            this.end = this.calculateEnd(this.start, controlTo)
            this.updateControlValue = this.left.getPointPropertyUpdater(this.propertyName)
        } else {
            this.left = DUMMY_CONTROL
        }

        if (this.rightId !== '') {
            const foundRight = this.model.findControl(this.rightId)
            if (foundRight) {
                this.right = foundRight
                this.end = this.left.animateEndByPropertyAndTarget(this.propertyName, this.right)
                foundRight.normalizePositionUnit(this.end, this.model.cellSize)
            }
        }
    }

    override onBeforeForward() {
        super.onBeforeForward()
        this.selectControls()
    }

    calculateEnd(start: Point, change: Point) {
        if (change.sign == Sign.NONE) {
            return new Point(change.x, change.y)
        } else if (change.sign == Sign.PLUS) {
            return new Point(start.x + change.x, start.y + change.y)
        } else {
            return new Point(start.x - change.x, start.y - change.y)
        }
    }

    override updateValue(progress: number) {
        if (progress == 0) {
            this.updateControlValue(this.start.x, this.start.y)

        } else if (progress == 1) {
            this.updateControlValue(this.end.x, this.end.y)

        } else {
            this.updateControlValue(
                this.start.x + (this.end.x - this.start.x) * progress,
                this.start.y + (this.end.y - this.start.y) * progress
            )
        }
    }

}
