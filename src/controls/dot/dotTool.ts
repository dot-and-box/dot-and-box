import {Tool} from "../../shared/tool.ts";
import {Point} from "../../shared/point.ts";
import {DotsAndBoxes} from "../../dotsAndBoxes.ts";
import {DotControl} from "./dotControl.ts";
import {COLORS, DEFAULT_DOT_SIZE} from "../../shared/constants.ts";

export class DotTool extends Tool {

    dotsAndBoxes: DotsAndBoxes

    constructor(dots: DotsAndBoxes) {
        super()
        this.dotsAndBoxes = dots
    }

    override click(point: Point): void {
        const controls = this.dotsAndBoxes.controls;
        const id = `${controls.length + 1}`
        controls.push(new DotControl(id, point, DEFAULT_DOT_SIZE, COLORS[controls.length % COLORS.length], id))
    }

}