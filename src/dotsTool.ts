import {Tool} from "./tool.ts";
import {Control, Dot} from "./dot.ts";
import {Point} from "./point.ts";
import {COLORS, SIZES} from "./constants.ts";

export class DotsTool extends Tool {

    controls: Control[]

    constructor(controls: Control[]) {
        super()
        this.controls = controls
    }

    override click(point: Point): void {
        this.controls.push(new Dot(
            point,
            COLORS[this.controls.length % COLORS.length],
            SIZES[this.controls.length % SIZES.length],
            this.controls.length.toString(),
        ))
    }

}