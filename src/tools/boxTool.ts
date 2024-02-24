import {Tool} from "../shared/tool.ts"
import {Point} from "../shared/point.ts"
import {BoxControl} from "../controls/box/boxControl.ts"
import {COLORS, DEFAULT_FONT_SIZE} from "../shared/constants.ts"
import {Sign} from "../shared/sign.ts";
import {Unit} from "../shared/unit.ts";

export class BoxTool extends Tool {

    dragStart: Point = Point.zero()

    override click(point: Point): void {
        const controls = this.dotsAndBoxes.model.controls
        this.dragStart = point
        const id = `box ${BoxControl.counter++}`
        this.dotsAndBoxes.model.controls.push(
            new BoxControl(id, point,
                new Point(this.dotsAndBoxes.model.cellSize, this.dotsAndBoxes.model.cellSize, Sign.NONE, Unit.CELL),
                DEFAULT_FONT_SIZE, COLORS[controls.length % COLORS.length], id, true, false))
        this.dotsAndBoxes.resetTool()
    }

}