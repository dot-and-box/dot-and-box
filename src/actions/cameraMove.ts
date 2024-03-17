import {ActionBase} from "../shared/actionBase.ts"
import {Point} from "../shared/point.ts"

import {DotAndBoxModel} from "../shared/dotAndBoxModel.ts";

export class CameraMove extends ActionBase {
    start: Point = Point.zero()
    to: Point = Point.zero()

    constructor(model: DotAndBoxModel, to: Point) {
        super(model)
        this.to = to.clone()
        this.to.normalizeUnit(model.cellSize)
    }

    onBeforeForward() {
        super.onBeforeForward();
        this.start = this.model.offset.clone()
    }

    init() {
        super.init();
    }

    override updateValue(progress: number) {
        this.model.offset.x = this.start.x - this.to.x * progress
        this.model.offset.y = this.start.y - this.to.y * progress
    }

}
