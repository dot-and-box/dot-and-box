import {Tool} from "../shared/tool.ts"
import {Point} from "../shared/point.ts"
import {DotsAndBoxes} from "../dotsAndBoxes.ts"

export class PanZoomTool extends Tool {

    dotsAndBoxes: DotsAndBoxes
    dragStart: Point = Point.zero()

    constructor(dots: DotsAndBoxes) {
        super()
        this.dotsAndBoxes = dots
    }

    override click(point: Point): void {
        this.dragStart = point
        this.dotsAndBoxes.controls.forEach(c=> c.hitTest(point))
    }

    override move(movePoint: Point) {
        this.dotsAndBoxes.model.offset = new Point(
            movePoint.x - this.dragStart.x,
            movePoint.y - this.dragStart.y
        )
    }

}