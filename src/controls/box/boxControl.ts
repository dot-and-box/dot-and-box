import {Point} from "../../shared/point.ts"
import {
    BLACK,
    DEFAULT_FONT,
    DEFAULT_LINE_WIDTH,
    POSITION,
    SELECTION_LINE_WIDTH,
    SELECTION_STROKE_STYLE,
    SIZE,
    WHITE
} from "../../shared/constants.ts"
import {Control, PropertyUpdater, TextControl} from "../control.ts"
import {WrappedText} from "../text/wrappedText.ts";
import {Align} from "../../shared/align.ts";
import {VerticalAlign} from "../../shared/verticalAlign.ts";

export class BoxControl extends Control implements TextControl {
    get fontSize(): number {
        return this._fontSize;
    }

    set fontSize(value: number) {
        this._fontSize = value;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
        this.textControl.text = this.text
    }

    override get center(): Point {
        return new Point(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
    }

    public color: string
    public textColor: string
    public borderColor: string
    public align: Align
    public verticalAlign: VerticalAlign
    public size: Point
    private _text: string
    public id: string
    static counter = 1
    public selected: boolean
    private _fontSize: number
    textControl: WrappedText

    constructor(id: string, position: Point, size: Point, fontSize: number, color: string,
                textColor: string, borderColor: string,
                align: Align, verticalAlign: VerticalAlign,
                text: string,
                visible: boolean, selected: boolean) {
        super()
        this.id = id
        this.position = position
        this.size = size
        this._fontSize = fontSize
        this.color = color
        this.textColor = textColor
        this.borderColor = borderColor
        this.align = align
        this.verticalAlign = verticalAlign
        this._text = text
        this.selected = selected
        this.visible = visible
        this.textControl = new WrappedText(text, this.position, DEFAULT_FONT, this._fontSize, BLACK, this.size, align, verticalAlign)
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color != WHITE
            ? WHITE
            : BLACK
        ctx.strokeStyle = BLACK

        if (this.color != WHITE) {
            ctx.fillStyle = this.color
            ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
        }
        ctx.strokeStyle = this.selected ? SELECTION_STROKE_STYLE : this.borderColor
        ctx.lineWidth = this.selected ? SELECTION_LINE_WIDTH : DEFAULT_LINE_WIDTH
        ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y)

        this.textControl.fontSize = this._fontSize
        this.textControl.color = this.textColor
        ctx.textBaseline = 'top'
        this.textControl.draw(ctx)
    }

    hitTest(point: Point): boolean {
        const x = point.x
        const y = point.y
        return x >= this.position.x && x <= this.position.x + this.size.x &&
            y >= this.position.y && y <= this.position.y + this.size.y
    }

    clone(): Control {
        return new BoxControl(this.id.toString(),
            this.position.clone(),
            this.size.clone(),
            this._fontSize,
            this.color.toString(),
            this.textColor.toString(),
            this.borderColor.toString(),
            this.align,
            this.verticalAlign,
            this._text.toString(),
            this.visible,
            this.selected)
    }

    override getPointPropertyUpdater(name: string): PropertyUpdater {
        if (name == POSITION) {
            return (x: number, y: number) => {
                this.updatePosition(x, y)
            }
        } else if (name == SIZE) {
            return (x: number, y: number) => {
                this.size.x = Math.abs(x)
                this.size.y = Math.abs(y)
            }
        } else {
            throw new Error('not implemented')
        }
    }

    animateEndByPropertyAndTarget(propertyName: string, targetControl: Control, offset: Point): Point {
        if (propertyName == POSITION) {
            return new Point(targetControl.center.x - this.size.x / 2 + offset.x, targetControl.center.y - this.size.y / 2 + offset.y);
        } else if (propertyName == SIZE) {
            return new Point(targetControl.size.x + offset.x, targetControl.size.y + offset.y)
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


}
