import {Tool} from "../shared/tool.ts"
import {Point} from "../shared/point.ts"
import {BoxControl} from "../controls/box/boxControl.ts"
import {DEFAULT_BOX_COLOR, DEFAULT_FONT_SIZE} from "../shared/constants.ts"

export class BoxTool extends Tool {

    dragStart: Point = Point.zero()


    override click(point: Point): void {
        this.dragStart = point
        const id = `box ${BoxControl.counter++}`
        this.dotsAndBoxes.model.controls.push(new BoxControl(id, point, new Point(100, 50),DEFAULT_FONT_SIZE, DEFAULT_BOX_COLOR, id, true, false))
        this.dotsAndBoxes.resetTool()
    }

}