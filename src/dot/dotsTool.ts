import {Tool} from "../shared/tool.ts";
import {Point} from "../shared/point.ts";
import {DotsAndBoxes} from "../dotsAndBoxes.ts";

export class DotsTool extends Tool {

    dots: DotsAndBoxes

    constructor(dots: DotsAndBoxes) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dots.addDotControl(point)
    }

}