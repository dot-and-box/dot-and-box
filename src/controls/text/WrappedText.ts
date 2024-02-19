import {Control} from "../control.ts";
import {Point} from "../../shared/point.ts";
import {DEFAULT_FONT, DEFAULT_FONT_SIZE} from "../../shared/constants.ts";

export class WrappedText extends Control {
    get maxHeight(): number {
        return this._maxHeight;
    }

    set maxHeight(value: number) {
        this._maxHeight = value;
    }

    get center(): boolean {
        return this._center;
    }

    set center(value: boolean) {
        this._center = value;
    }

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }

    get fontName(): string {
        return this._fontName;
    }

    set fontName(value: string) {
        this._fontName = value;
    }

    get fontSize(): number {
        return this._fontSize;
    }

    set fontSize(value: number) {
        this._fontSize = value;
        this._textData = []
    }

    get maxWidth(): number {
        return this._maxWidth;
    }

    set maxWidth(value: number) {
        this._maxWidth = value;
        this._textData = []
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        if (this._text !== value) {
            this._text = value;
            this._textData = []
        }
    }

    private _center = false

    private _color: string = 'black'

    private _fontName: string = DEFAULT_FONT

    private _fontSize: number = DEFAULT_FONT_SIZE;

    private _maxWidth: number = 100;

    private _maxHeight: number = 100;

    private _spanX: number = 0;

    private _spanY: number = 0;

    private _text: string

    private _textData: Array<string>


    constructor(text: string, position: Point, fontName: string, fontSize: number, color: string, maxWidth: number, maxHeight: number, center: boolean) {
        super();
        this.position = position
        this._fontName = fontName;
        this._fontSize = fontSize;
        this._maxWidth = maxWidth;
        this._maxHeight = maxHeight;
        this._text = text;
        this._color = color
        this._center = center
        this._textData = [];
    }

    clone(): Control {
        return new WrappedText(this._text, this.position, this._fontName, this._fontSize, this._color, this._maxWidth, this._maxHeight, this._center);
    }

    override updatePosition(x: number, y: number) {
        super.updatePosition(x, y);
        this._textData = []
    }

    drawn = false

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this._color
        ctx.font = `${this._fontSize}px ${this._fontName}`

        if (this._textData.length == 0) {
            this.wrapText(ctx)
        }
        let index = 0;
        for (const line of this._textData) {
            ctx.fillText(line, this.position.x + this._spanX, this.position.y + this._spanY + this._fontSize * index++)
        }
        if (!this.drawn) {
            this.drawn = true
        }
    }

    // @ts-ignore
    hitTest(point: Point): boolean {
        return false;
    }

    // quite inefficient - needs better implementation
    wrapText(ctx: CanvasRenderingContext2D): void {
        let y: number = 0
        let maxLineWidth = 0
        const result: Array<string> = []
        const lines = this._text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = '';
            let words = lines[i].split(' ');
            for (let j = 0; j < words.length; j++) {
                let testLine = line + words[j]
                let metrics = ctx.measureText(testLine);
                let testWidth = metrics.width;
                if (testWidth > maxLineWidth) {
                    maxLineWidth = testWidth
                }
                testLine += ' '
                if (testWidth > this._maxWidth) {
                    result.push(line);
                    line = words[j] + ' '
                    y += this._fontSize;
                } else {
                    line = testLine;
                }
            }
            result.push(line);
            y += this._fontSize;
        }
        if (this._center) {
            this._spanX = this._maxWidth < maxLineWidth ? 0 : (this._maxWidth - maxLineWidth) / 2
            this._spanY = (this._maxHeight - (result.length * this.fontSize)) / 2 + this.fontSize / 2
        }

        this._textData = result
    }

}
