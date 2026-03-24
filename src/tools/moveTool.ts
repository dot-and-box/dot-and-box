import { Point } from "../shared/point.ts"
import { Control } from "../controls/control.ts";
import { Tool } from "../shared/tool.ts"

export class MoveTool extends Tool {

    public static NAME: string = "move-tool"

    dragStart: Point = Point.zero()
    selectedControl: Control | null = null
    initialX = 0;
    initialY = 0;

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
            this.initialX = this.selectedControl.position.x
            this.initialY = this.selectedControl.position.y
        }
    }

    override move(movePoint: Point) {
        if (this.selectedControl) {
            const deltaX = movePoint.x - this.dragStart.x
            const deltaY = movePoint.y - this.dragStart.y


            this.selectedControl.position.x =  this.initialX + deltaX
            this.selectedControl.position.y =  this.initialY + deltaY
        }
    }

    get name(): string {
        return MoveTool.NAME;
    }

}
