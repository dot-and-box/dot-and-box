import {Tool} from "./tool.ts";
import {Point} from "./point.ts";
import {DotsJustDots} from "./dotsJustDots.ts";

export class PanZoomTool extends Tool {

    dots: DotsJustDots
    dragStart: Point = Point.zero()

    constructor(dots: DotsJustDots) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dragStart = point
        console.log(point)
        this.dots.controls.forEach(c=> c.hitTest(point))
    }

    override move(movePoint: Point) {
        this.dots.offset = new Point(
            movePoint.x - this.dragStart.x,
            movePoint.y - this.dragStart.y
        )
    }

}