import {Point} from "../shared/point.ts";

export interface ControlBase {
    id: string
    position: Point
}


export interface Control extends ControlBase {

    selected: boolean

    visible: boolean

    draw(ctx: CanvasRenderingContext2D): void

    hitTest(point: Point): boolean;

    clone(): Control;
}