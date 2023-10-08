import {Tool} from "../shared/tool.ts";
import {Point} from "../shared/point.ts";
import {Box} from "./box.ts";
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

        this.dots.controls.push(new Box(
            point,
            "rgba(37,33,133,0.68)",
            new Point(50, 50),
            this.dots.controls.length.toString(),
        ))

    }


}