import {Tool} from "./tool.ts";
import {Point} from "./point.ts";
import {DotsJustDots} from "./dotsJustDots.ts";

export class DotsTool extends Tool {

    dots: DotsJustDots

    constructor(dots: DotsJustDots) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dots.addDot(point)
    }

}