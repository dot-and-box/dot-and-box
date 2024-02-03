import {Tool} from "../shared/tool.ts"
import {Point} from "../shared/point.ts"
import {DotControl} from "../controls/dot/dotControl.ts"
import {COLORS, DEFAULT_DOT_SIZE} from "../shared/constants.ts"

export class DotTool extends Tool {

    override click(point: Point): void {
        const controls = this.model.controls
        const id = `${controls.length + 1}`
        controls.push(new DotControl(id, point, DEFAULT_DOT_SIZE, COLORS[controls.length % COLORS.length], id, true, false))
    }

}