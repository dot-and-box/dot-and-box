import {Point} from "../shared/point.ts";
import {Control} from "../dot/dotControl.ts";
import {DEFAULT_FONT} from "../shared/constants.ts";

export class TextControl implements Control {
    public position: Point
    public color: string
    public size: Point
    public text: string

    constructor(position: Point, color: string, size: Point, text: string) {
        this.position = position
        this.color = color
        this.size = size
        this.text = text
        this.selected = false
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.font = DEFAULT_FONT
        ctx.fillStyle = "orange"
        const textOffset = this.size.x / 2
        const xOffset = textOffset - this.text.length * 8
        ctx.fillText(this.text, this.position.x + xOffset, this.position.y + this.size.y / 2)
    }

    selected: boolean;

    hitTest(point: Point): boolean {
        return false;
    }

}
