import {Tool} from "../shared/tool.ts"
import {Point} from "../shared/point.ts"

export class PanZoomTool extends Tool {

    dragStart: Point = Point.zero()

    override click(point: Point): void {
        this.dragStart = point
        this.model.controls.forEach(c => c.hitTest(point))
    }

    override move(movePoint: Point) {
        this.model.offset = new Point(
            movePoint.x - this.dragStart.x,
            movePoint.y - this.dragStart.y
        )
    }

}