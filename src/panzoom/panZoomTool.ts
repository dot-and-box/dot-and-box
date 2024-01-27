import {Tool} from "../shared/tool.ts"
import {Point} from "../shared/point.ts"
import {DotsAndBoxes} from "../dotsAndBoxes.ts"

export class PanZoomTool extends Tool {

    dots: DotsAndBoxes
    dragStart: Point = Point.zero()

    constructor(dots: DotsAndBoxes) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dragStart = point
        this.dots.controls.forEach(c=> c.hitTest(point))
    }

    override move(movePoint: Point) {
        this.dots.offset = new Point(
            movePoint.x - this.dragStart.x,
            movePoint.y - this.dragStart.y
        )
    }

}