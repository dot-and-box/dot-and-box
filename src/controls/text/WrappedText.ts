import { Control } from "../control.ts";
import { Point } from "../../shared/point.ts";
import { DEFAULT_FONT, DEFAULT_FONT_SIZE, POSITION, SIZE } from "../../shared/constants.ts";

export class WrappedText extends Control {

    get centered(): boolean {
        return this._centered;
    }

    set centered(value: boolean) {
        this._centered = value;
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
        if (this._fontName !== value) {
            this._dirty = true;
            this._fontName = value;
        }
    }

    get fontSize(): number {
        return this._fontSize;
    }

    set fontSize(value: number) {
        if (this._fontSize !== value) {
            this._dirty = true
            this._fontSize = value;
        }
    }


    get text(): string {
        return this._text;
    }

    set visible(val: boolean) {
        this._dirty = true;
        this._visible = val;
    }

    set text(value: string) {
        if (this._text !== value) {
            this._dirty = true;
            this._text = value;
        }
    }


    private _centered = false
    private _color: string = 'black'
    private _fontName: string = DEFAULT_FONT
    private _fontSize: number = DEFAULT_FONT_SIZE;
    private _spanX: number = 0;
    private _spanY: number = 0;
    private _text: string
    private _dirty: boolean = true;
    private _textData: Array<string>

    constructor(text: string, position: Point, fontName: string, fontSize: number, color: string, size: Point, centered: boolean) {
        super();
        this.position = position
        this._fontName = fontName;
        this._fontSize = fontSize;
        this._text = text;
        this._color = color
        this._centered = centered
        this._textData = [];
        this.size = size
    }

    clone(): Control {
        return new WrappedText(this._text, this.position, this._fontName, this._fontSize, this._color, this.size.clone(), this._centered);
    }

    override updatePosition(x: number, y: number) {
        super.updatePosition(x, y)
        this._dirty = true  // TODO better optimisation
        this._textData = []
    }


    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this._color
        ctx.font = `${this._fontSize}px ${this._fontName}`

        if (this._dirty) {
            this.wrapText(ctx)
        }
        let index = 0;
        for (const line of this._textData) {
            ctx.fillText(line, this.position.x + this._spanX, this.position.y + this._spanY + this._fontSize * index++)
        }
    }

    // @ts-ignore
    hitTest(point: Point): boolean {
        return false;
    }

    // TODO quite inefficient - needs better implementation
    wrapText(ctx: CanvasRenderingContext2D): void {
        let y: number = 0
        let maxLineWidth = 0
        const result: Array<string> = []
        const lines = this._text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            let line = '';
            let words = lines[i].trim().split(' ');
            for (let j = 0; j < words.length; j++) {
                let testLine = line + words[j]
                let metrics = ctx.measureText(testLine);
                let testWidth = metrics.width;
                if (testWidth > maxLineWidth) {
                    maxLineWidth = testWidth
                }
                testLine += ' '
                if (testWidth > this.size.x) {
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
        if (this._centered) {
            this._spanX = this.size.x < maxLineWidth ? 0 : (this.size.x - maxLineWidth) / 2
            this._spanY = (this.size.y - (result.length * this.fontSize)) / 2 + this.fontSize / 2
        }
        this._textData = result
        this._dirty = false
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

    animateEndByPropertyAndTarget(_: string, __: Control): Point {
        throw new Error('unimplemented exception')
    }

}
