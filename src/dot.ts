import {Point} from "./point.ts";

export class Dot implements Control{
    public position: Point
    public color: string
    public size: number
    public text: string

    constructor(position: Point, color: string, size: number, text: string) {
        this.position = position
        this.color = color
        this.size = size
        this.text = text
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath()
        ctx.font = `${this.size}px courier`
        ctx.fillStyle = "white"
        const textOffset = this.size / 2 - 2
        const xOffset = textOffset * this.text.length
        ctx.fillText(this.text, this.position.x - xOffset, this.position.y + textOffset)
    }
}

export interface Control {
    draw(ctx: CanvasRenderingContext2D): void
}