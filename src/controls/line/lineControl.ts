import {Point} from "../../shared/point.ts"
import {SELECTION_STROKE_STYLE} from "../../shared/constants.ts"
import {Control} from "../control.ts"

export class LineControl extends Control {
    public color: string
    public _end: Point
    public width: number
    static counter = 1
    public selected: boolean
    public visible: boolean
    private distance: Point = Point.zero()

    public get end() {
        return this._end
    }

    public set end(newVal: Point) {
        this.distance = this.position.minus(this.end)
        this._end = newVal
    }

    constructor(id: string, position: Point, end: Point, width: number, color: string, visible: boolean, selected: boolean) {
        super()
        this.id = id
        this.position = position
        this._end = end
        this.distance = this._end.minus(this.position)
        this.width = width
        this.color = color
        this.selected = selected
        this.visible = visible
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.color

        if (this.selected) {
            ctx.strokeStyle = SELECTION_STROKE_STYLE
        }
        ctx.beginPath();
        ctx.lineWidth = this.width
        ctx.lineCap = "round"
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this._end.x, this._end.y);
        ctx.stroke();
    }

    // @ts-ignore
    hitTest(point: Point): boolean {
        return false;
    }

    clone(): Control {
        return new LineControl(this.id.toString(), this.position.clone(), this.end.clone(), this.width, this.color.toString(), this.visible, this.selected)
    }

    override updatePosition(x: number, y: number) {
        this.position.x = x
        this.position.y = y
        this._end.x = x + this.distance.x
        this._end.y = y + this.distance.y
    }

}
