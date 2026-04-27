import { Tool } from "../shared/tool.ts"
import { Point } from "../shared/point.ts"
import { Control } from "../controls/control.ts";

export class PanZoomTool extends Tool {

    public static NAME: string = "pan-zoom-tool"

    dragStart: Point = Point.zero()

    override click(point: Point): void {
        this.dragStart = point
        const hitControls: Control[] = []
        this.dotAndBox.model.controls.forEach(c => {
            if (c.hitTest(point)) {
                hitControls.push(c)
            }
        })
        if (hitControls.length > 0) {
            let ctrl = hitControls[hitControls.length - 1]
            ctrl.selected =  !ctrl.selected
            this.dotAndBox.model.applySelected(hitControls)
        }
    }

    override move(movePoint: Point) {
        let offset = this.dotAndBox.model.offset
        this.dotAndBox.model.offset.x = movePoint.x + offset.x - this.dragStart.x
        this.dotAndBox.model.offset.y = movePoint.y + offset.y - this.dragStart.y
    }

    get name(): string {
        return PanZoomTool.NAME;
    }

}
