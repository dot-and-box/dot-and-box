import {Point} from "../shared/point.ts";
import {SELECTION_STROKE_STYLE, DEFAULT_FONT} from "../shared/constants.ts";

export class DotControl implements Control {
    public position: Point
    public color: string
    public size: number
    public text: string
    public selected: boolean;
    public id: string;


    constructor(id: string, position: Point, color: string, size: number, text: string) {
        this.id = id;
        this.position = position
        this.color = color
        this.size = size
        this.text = text
        this.selected = false
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (this.selected) {
            ctx.strokeStyle = SELECTION_STROKE_STYLE
            ctx.stroke()
        }
        ctx.closePath()
        ctx.font = `${this.size}px ${DEFAULT_FONT}`
        ctx.fillStyle = "white"
        const textOffset = this.size / 2 - this.size / 4 + 1
        const xOffset = textOffset * this.text.length
        ctx.fillText(this.text, this.position.x - xOffset, this.position.y + textOffset)
    }

    hitTest(point: Point): boolean {
        let tx = this.position.x - point.x;
        let ty = this.position.y - point.y;
        const isHit = tx * tx + ty * ty <= this.size  * this.size
        if (isHit) {
            this.selected = !this.selected
        }
        return isHit
    }


}


export interface ControlBase {
    id: string
    position: Point
}

export interface Control extends ControlBase {

    selected: boolean

    draw(ctx: CanvasRenderingContext2D): void

    hitTest(point: Point): boolean;
}