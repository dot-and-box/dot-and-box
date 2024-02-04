import {Point} from "../../shared/point.ts"
import {Control} from "../control.ts"

export class DummyControl extends Control {
    position: Point
    selected: boolean = false
    visible: boolean = true


    public constructor() {
        super()
        this.id = 'dummy'
        this.position = Point.zero()
    }

    clone(): Control {
        return new DummyControl()
    }

    draw(ctx: CanvasRenderingContext2D): void {
        console.log(`dummy draw on ${ctx}`)
    }

    // @ts-ignore
    hitTest(point: Point): boolean {
        return false
    }

    static getInstance() {
        return new DummyControl()
    }
}
