import {Point} from "../shared/point.ts";
import {Control} from "../dot/dot.ts";
import {SELECTION_STROKE_STYLE} from "../shared/constants.ts";

export class Box implements Control {
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
        if (this.selected) {
            ctx.strokeStyle = SELECTION_STROKE_STYLE
        } else {
            ctx.strokeStyle = "black"
        }
        ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y)
        ctx.font = `22px courier`
        ctx.fillStyle = "orange"

        const textOffset = this.size.x / 2
        const xOffset = textOffset - this.text.length * 8
        ctx.fillText(this.text, this.position.x + xOffset, this.position.y + this.size.y / 2)
    }

    selected: boolean;

    hitTest(point: Point): boolean {
        const x = point.x;
        const y = point.y
        const isHit = x >= this.position.x && x <= this.position.x + this.size.x &&
            y >= this.position.y && y <= this.position.y + this.size.y;
        if (isHit) {
            this.selected = !this.selected
        }
        return isHit
    }
}
