import {Point} from "../../shared/point.ts"
import {SELECTION_STROKE_STYLE, DEFAULT_FONT, WHITE, BLACK} from "../../shared/constants.ts"
import {Control} from "../control.ts"

export class DotControl implements Control {
    public position: Point
    public color: string
    public size: number
    public text: string
    public id: string
    public selected: boolean
    public visible: boolean

    constructor(id: string, position: Point, size: number, color: string, text: string, visible: boolean) {
        this.id = id
        this.position = position
        this.color = color
        this.size = size
        this.text = text
        this.selected = false
        this.visible = visible
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false)
        ctx.fillStyle = this.color
        ctx.fill()
        if (this.selected) {
            ctx.strokeStyle = SELECTION_STROKE_STYLE
            ctx.stroke()
        }
        ctx.closePath()
        const textSize = this.text.length > 1 ? this.size * 0.8 : this.size * 1.2
        ctx.font = `${textSize}px ${DEFAULT_FONT}`
        ctx.fillStyle = this.color != WHITE ? WHITE : BLACK
        const textOffset = textSize / 2 - textSize / 4 + 1
        const xOffset = textOffset * this.text.length
        ctx.fillText(this.text, this.position.x - xOffset, this.position.y + textOffset)
    }

    hitTest(point: Point): boolean {
        let tx = this.position.x - point.x
        let ty = this.position.y - point.y
        return tx * tx + ty * ty <= this.size * this.size
    }

    clone(): Control {
        return new DotControl(this.id.toString(), this.position.clone(), this.size, this.color.toString(), this.text.toString(), this.visible)
    }


}
