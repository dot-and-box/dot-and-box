import { Tool } from "../shared/tool.ts"
import { Point } from "../shared/point.ts"
import { DotControl } from "../controls/dot/dotControl.ts"
import { COLORS, DEFAULT_DOT_SIZE } from "../shared/constants.ts"
import { DOT_TOOL } from "../shared/elemConstants.ts";

export class DotTool extends Tool {

  override click(point: Point): void {
    const controls = this.dotAndBox.model.controls
    const id = `${controls.length + 1}`
    controls.push(new DotControl(id, point, DEFAULT_DOT_SIZE, COLORS[controls.length % COLORS.length], id, true, false))
    this.dotAndBox.resetTool()
  }

  get name(): string {
    return DOT_TOOL
  }

}
