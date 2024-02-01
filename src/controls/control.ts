import {Point} from "../shared/point.ts"
import {DummyControl} from "./dummy/dummyControl.ts";

export interface ControlBase {
    id: string
    position: Point
}


export interface Control extends ControlBase {

    selected: boolean

    visible: boolean

    draw(ctx: CanvasRenderingContext2D): void

    hitTest(point: Point): boolean

    clone(): Control
}

export const DUMMY_CONTROL = new DummyControl()