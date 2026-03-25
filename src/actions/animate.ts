import {ActionBase} from "../shared/actionBase.ts"
import {Point} from "../shared/point.ts"
import {Control, PropertyUpdater} from "../controls/control.ts"
import {Sign} from "../shared/sign.ts"
import {DUMMY_CONTROL} from "../shared/constants.ts";
import {DotAndBoxModel} from "../shared/dotAndBoxModel.ts";

export class Animate extends ActionBase {
    to: Point
    right: Control = DUMMY_CONTROL
    leftId: string
    rightId: string = ''
    propertyName: string = ''
    relativeToRight: boolean = false;
    propertiesToUpdate: { control: Control, start: Point, end: Point, update: PropertyUpdater }[] = []

    constructor(model: DotAndBoxModel, property: string, leftId: string, to: Point, rightId = '', relativeToRight: boolean) {
        super(model)
        this.propertyName = property
        this.to = to
        this.leftId = leftId
        this.rightId = rightId
        this.relativeToRight = relativeToRight;
        this.propertiesToUpdate = []
    }

    override init() {
        super.init()
        this.selectControls()
    }

    selectControls() {
        const foundControls = this.model.findControls(this.leftId)
        if (foundControls.length > 0) {
            let controlTo = this.to.clone()
            for (const foundControl of foundControls) {
                foundControl.normalizePositionUnit(controlTo, this.model.cellSize)
                let start = foundControl.getPropertyValue(this.propertyName) as Point;
                this.propertiesToUpdate.push({
                    control: foundControl,
                    start: start.clone(),
                    end: this.calculateEnd(start, controlTo),
                    update: foundControl.getPointPropertyUpdater(this.propertyName)
                })
            }
        }

        if (this.rightId !== '') {
            const foundRight = this.model.findControl(this.rightId)
            if (foundRight) {
                this.right = foundRight
                this.to.normalizeUnit(this.model.cellSize);
                for (const property of this.propertiesToUpdate) {
                    property.end = property.control.animateEndByPropertyAndTarget(this.propertyName, this.right, this.relativeToRight ? this.to : Point.zero())
                }
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
            this.propertiesToUpdate.forEach(c => c.update(c.start.x, c.start.y));
        } else if (progress == 1) {
            this.propertiesToUpdate.forEach(c => c.update(c.end.x, c.end.y));
        } else {
            this.propertiesToUpdate.forEach(c => {
                    c.update(
                        c.start.x + (c.end.x - c.start.x) * progress,
                        c.start.y + (c.end.y - c.start.y) * progress
                    );
                }
            );
        }
    }

}
