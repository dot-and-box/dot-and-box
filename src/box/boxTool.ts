import {Tool} from "../shared/tool.ts";
import {Point} from "../shared/point.ts";
import {BoxControl} from "./boxControl.ts";
import {DotsAndBoxes} from "../dotsAndBoxes.ts";

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
            "rgba(37,33,133,0.68)",
            new Point(100, 50),
            id,
        ))

    }


}