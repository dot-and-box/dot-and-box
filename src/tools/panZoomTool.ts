import {Tool} from "../shared/tool.ts"
import {Point} from "../shared/point.ts"

export class PanZoomTool extends Tool {

    dragStart: Point = Point.zero()

    override click(point: Point): void {
        this.dragStart = point
        const hitControls = []
        this.model.controls.forEach(c => {
            if (c.hitTest(point)) {
                hitControls.push(c)
            }
        })
        if (hitControls.length > 0) {
            this.model.changeSelected(hitControls)
        }
    }

    override move(movePoint: Point) {
        this.model.offset = new Point(
            movePoint.x - this.dragStart.x,
            movePoint.y - this.dragStart.y
        )
    }

}