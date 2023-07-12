import {Point} from "./point.ts";
import {Control} from "./dot.ts";

export class Component implements Control {
    public position: Point
    public color: string
    public size: Point
    public text: string

    constructor(position: Point, color: string, size: Point, text: string) {
        this.position = position
        this.color = color
        this.size = size
        this.text = text
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        ctx.font = `${this.size}px courier`
        ctx.fillStyle = "white"
        const textOffset = this.size.x / 2 - 2
        ctx.fillText(this.text, this.position.x, this.position.y + textOffset)
    }
}
