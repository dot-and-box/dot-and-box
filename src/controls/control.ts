import {Point} from "../shared/point.ts"

export interface ControlBase {
    id: string
    position: Point
}

export abstract class Control implements ControlBase {
    id: string = '';
    position: Point = Point.zero();
    selected: boolean = false
    visible: boolean = true

    abstract draw(ctx: CanvasRenderingContext2D): void

    abstract hitTest(point: Point): boolean

    updatePosition(x: number, y: number) {
        this.position.x = x
        this.position.y = y
    }

    normalizePositionUnit(point: Point, cellSize: number): void {
        point.normalizeUnit(cellSize)
    }

    abstract clone(): Control
}