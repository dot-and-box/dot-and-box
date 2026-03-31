import {Tool} from "../shared/tool.ts"
import {Point} from "../shared/point.ts"
import {BoxControl} from "../controls/box/boxControl.ts"
import {COLORS, DEFAULT_FONT_SIZE} from "../shared/constants.ts"
import {Sign} from "../shared/sign.ts";
import {Unit} from "../shared/unit.ts";
import {BOX_TOOL} from "../shared/elemConstants.ts";
import {Align} from "../shared/align.ts";
import {VerticalAlign} from "../shared/verticalAlign.ts";

export class BoxTool extends Tool {
    dragStart: Point = Point.zero()

    override click(point: Point): void {
        const controls = this.dotAndBox.model.controls
        this.dragStart = point
        const id = `box ${BoxControl.counter++}`
        this.dotAndBox.model.controls.push(
            new BoxControl(id, point,
                new Point(this.dotAndBox.model.cellSize, this.dotAndBox.model.cellSize, Sign.NONE, Unit.CELL),
                DEFAULT_FONT_SIZE, COLORS[controls.length % COLORS.length],'white','black',Align.CENTER, VerticalAlign.CENTER, id, true, false))
        this.dotAndBox.resetTool()
    }

    get name(): string {
        return BOX_TOOL
    }
}
