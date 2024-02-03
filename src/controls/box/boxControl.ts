import {Point} from "../../shared/point.ts"
import {BLACK, DEFAULT_FONT, DEFAULT_FONT_SIZE, SELECTION_STROKE_STYLE, WHITE} from "../../shared/constants.ts"
import {Control} from "../control.ts"

export class BoxControl implements Control {
    public position: Point
    public color: string
    public size: Point
    public text: string
    public id: string
    static counter = 1
    public selected: boolean
    public visible: boolean

    constructor(id: string, position: Point, size: Point, color: string, text: string, visible: boolean, selected: boolean) {
        this.id = id
        this.position = position
        this.size = size
        this.color = color
        this.text = text
        this.selected = selected
        this.visible = visible
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color != WHITE
            ? WHITE
            : BLACK
        ctx.strokeStyle = BLACK
        ctx.font = `${DEFAULT_FONT_SIZE}px ${DEFAULT_FONT}`

        if (this.color != WHITE) {
            ctx.fillStyle = this.color
            ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
        }

        if (this.selected || this.color != WHITE) {
            ctx.strokeStyle = this.selected ? SELECTION_STROKE_STYLE : BLACK
            ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y)
        }

        const textOffset = this.size.x / 2 - ctx.measureText(this.text).width / 2
        ctx.fillStyle = this.color != WHITE ? WHITE : BLACK
        ctx.fillText(this.text, this.position.x + textOffset, this.position.y + this.size.y / 2)
    }

    hitTest(point: Point): boolean {
        const x = point.x
        const y = point.y
        return x >= this.position.x && x <= this.position.x + this.size.x &&
            y >= this.position.y && y <= this.position.y + this.size.y
    }

    clone(): Control {
        return new BoxControl(this.id.toString(), this.position.clone(), this.size.clone(), this.color.toString(), this.text.toString(), this.visible, this.selected)
    }

}
