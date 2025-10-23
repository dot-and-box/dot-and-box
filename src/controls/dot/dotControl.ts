import { Point } from "../../shared/point.ts"
import {
    BLACK,
    DEFAULT_FONT,
    DEFAULT_FONT_SIZE,
    DEFAULT_LINE_WIDTH, POSITION,
    SELECTION_STROKE_STYLE, SIZE,
    WHITE
} from "../../shared/constants.ts"
import { Control, TextControl } from "../control.ts"
import { Unit } from "../../shared/unit.ts";
import { Sign } from "../../shared/sign.ts";

export class DotControl extends Control implements TextControl {
    public color: string
    public text: string
    public id: string
    public selected: boolean
    public fontSize: number | null
    public radius: number

    constructor(id: string, position: Point, radius: number, color: string, text: string, visible: boolean, selected: boolean, fontSize: number | null = null) {
        super()
        this.id = id
        this.position = position
        this.radius = radius
        this.color = color
        this.size = new Point(radius * 2, radius * 2)
        this.text = text
        this.selected = selected
        this.visible = visible
        this.fontSize = fontSize
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = this.color
        ctx.fill()
        if (this.selected) {
            ctx.lineWidth = DEFAULT_LINE_WIDTH
            ctx.strokeStyle = SELECTION_STROKE_STYLE
            ctx.stroke()
        }
        ctx.closePath()
        let textOffset = 0
        let xOffset
        let fontSize = this.fontSize != null ? this.fontSize : DEFAULT_FONT_SIZE

        if (this.text.length > 3) {
            const fontSize = this.fontSize
            ctx.font = `${fontSize}px ${DEFAULT_FONT}`
            let metric = ctx.measureText(this.text)
            xOffset = metric.width / 2
        } else {
            let textSizeCoerced = this.text.length > 1 ? this.radius * 0.8 : this.radius * 1.2
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
        return tx * tx + ty * ty <= this.radius * this.radius
    }

    override normalizePositionUnit(point: Point, cellSize: number) {
        if (point.unit == Unit.CELL && point.sign == Sign.NONE) {
            DotControl.normalizeDotPosition(point, cellSize)
        } else {
            super.normalizePositionUnit(point, cellSize)
        }
    }

    public static normalizeDotPosition(point: Point, cellSize: number) {
        point.x = point.x * cellSize + cellSize / 2
        point.y = point.y * cellSize + cellSize / 2
        point.unit = Unit.PIXEL
    }

    clone(): Control {
        return new DotControl(this.id.toString(), this.position.clone(), this.radius, this.color.toString(), this.text.toString(), this.visible, this.selected)
    }


    override getPointPropertyUpdater(name: string): (x: number, y: number) => void {
        if (name === POSITION) {
            return (x: number, y: number) => this.updatePosition(x, y)
        } else if (name == SIZE) {
            return (x: number, _: number) => {
                this.size = new Point(Math.abs(x), Math.abs(x))
                this.radius = this.size.x / 2
            }
        } else {
            throw new Error('not implemented')
        }
    }


    getPointPropertyValue(name: string): Point {
        switch (name) {
            case POSITION:
                return this.position
            case SIZE:
                return this.size
            default:
                throw new Error('not implemented exception')
        }
    }

    animateEndByPropertyAndTarget(propertyName: string, targetControl: Control): Point {
        if (propertyName == POSITION) {
            return targetControl.center
        } else if (propertyName == SIZE) {
            return targetControl.size
        } else {
            throw new Error('not implemented')
        }
    }

}
