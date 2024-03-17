import {Point} from "../../shared/point.ts"
import {
    BLACK,
    DEFAULT_FONT,
    DEFAULT_FONT_SIZE,
    DEFAULT_LINE_WIDTH,
    SELECTION_STROKE_STYLE,
    WHITE
} from "../../shared/constants.ts"
import {Control} from "../control.ts"

export class DotControl extends Control {
    public color: string
    public size: number
    public text: string
    public id: string
    public selected: boolean
    public visible: boolean
    public fontSize: number | null

    constructor(id: string, position: Point, size: number, color: string, text: string, visible: boolean, selected: boolean, fontSize: number | null = null) {
        super()
        this.id = id
        this.position = position
        this.color = color
        this.size = size
        this.text = text
        this.selected = selected
        this.visible = visible
        this.fontSize = fontSize
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false)
        ctx.fillStyle = this.color
        ctx.fill()
        if (this.selected) {
            ctx.lineWidth = DEFAULT_LINE_WIDTH
            ctx.strokeStyle = SELECTION_STROKE_STYLE
            ctx.stroke()
        }
        ctx.closePath()
        let textOffset = 0
        let xOffset = 0
        let fontSize = this.fontSize != null ? this.fontSize : DEFAULT_FONT_SIZE

        if (this.text.length > 3) {
            const fontSize = this.fontSize
            ctx.font = `${fontSize}px ${DEFAULT_FONT}`
            let metric = ctx.measureText(this.text)
            xOffset = metric.width / 2
        } else {
            let textSizeCoerced = this.text.length > 1 ? this.size * 0.8 : this.size * 1.2
            fontSize = this.fontSize != null ? this.fontSize : textSizeCoerced
            textOffset = textSizeCoerced / 2 - textSizeCoerced / 4 + 1
            xOffset = textOffset * this.text.length
        }
        ctx.font = `${fontSize}px ${DEFAULT_FONT}`
        ctx.fillStyle = this.color != WHITE ? WHITE : BLACK
        ctx.fillText(this.text, this.position.x - xOffset, this.position.y + textOffset)
    }

    hitTest(point: Point): boolean {
        let tx = this.position.x - point.x
        let ty = this.position.y - point.y
        return tx * tx + ty * ty <= this.size * this.size
    }

    clone(): Control {
        return new DotControl(this.id.toString(), this.position.clone(), this.size, this.color.toString(), this.text.toString(), this.visible, this.selected)
    }

}
