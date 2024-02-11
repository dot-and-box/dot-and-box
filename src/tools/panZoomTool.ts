import {Tool} from "../shared/tool.ts"
import {Point} from "../shared/point.ts"
import {Control} from "../controls/control.ts";

export class PanZoomTool extends Tool {

    dragStart: Point = Point.zero()

    override click(point: Point): void {
        this.dragStart = point
        const hitControls: Control[] = []
        this.model.controls.forEach(c => {
            if (c.hitTest(point)) {
                hitControls.push(c)
            }
        })
        if (hitControls.length > 0) {
            hitControls.forEach(c=> c.selected = !c.selected)
            this.model.applySelected(hitControls)
        }
    }

    override move(movePoint: Point) {
        this.model.offset = new Point(
            movePoint.x - this.dragStart.x,
            movePoint.y - this.dragStart.y
        )
    }

}