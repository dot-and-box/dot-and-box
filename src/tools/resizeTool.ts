import { Point } from "../shared/point.ts"
import { Control } from "../controls/control.ts";
import { Tool } from "../shared/tool.ts"

export class ResizeTool extends Tool {

    public static NAME: string = "resize-tool"

    dragStart: Point = Point.zero()
    selectedControl: Control | null = null
    initialWidth: number = 0
    initialHeight: number = 0


    override click(point: Point): void {
        this.dragStart = point
        const hitControls: Control[] = []
        this.dotAndBox.model.controls.forEach(c => {
            if (c.hitTest(point)) {
                hitControls.push(c)
            }
        })

        if (hitControls.length > 0) {
            this.selectedControl = hitControls[0]
            this.initialWidth = this.selectedControl.size.x
            this.initialHeight = this.selectedControl.size.y
        }
    }

    override move(movePoint: Point) {
        if (this.selectedControl) {
            const deltaX = movePoint.x - this.dragStart.x
            const deltaY = movePoint.y - this.dragStart.y
            this.selectedControl.size.x = Math.max(10, this.initialWidth + deltaX)
            this.selectedControl.size.y = Math.max(10, this.initialHeight + deltaY)
        }
    }

    get name(): string {
        return ResizeTool.NAME;
    }

}
