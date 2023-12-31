import {Tool} from "../shared/tool.ts";
import {Point} from "../shared/point.ts";
import {BoxControl} from "./boxControl.ts";
import {DotsAndBoxes} from "../dotsAndBoxes.ts";
import {DEFAULT_BOX_COLOR} from "../shared/constants.ts";

export class BoxTool extends Tool {

    dots: DotsAndBoxes
    dragStart: Point = Point.zero()

    constructor(dots: DotsAndBoxes) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dragStart = point
        const id = `box ${BoxControl.counter++}`
        this.dots.controls.push(new BoxControl(
            id,
            point,
            DEFAULT_BOX_COLOR,
            new Point(100, 50),
            id,
        ))

    }


}