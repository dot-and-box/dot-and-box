import {Tool} from "./tool.ts";
import {Point} from "./point.ts";
import {Dots} from "./dots.ts";

export class PanZoomTool extends Tool {

    dots: Dots
    dragStart: Point = Point.zero()

    constructor(dots: Dots) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dragStart = point
    }

    override move(movePoint: Point) {
        this.dots.offset = new Point(
            movePoint.x - this.dragStart.x,
            movePoint.y - this.dragStart.y
        )
    }

}