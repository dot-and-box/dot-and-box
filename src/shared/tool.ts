import { Point } from "./point.ts"
import { DotAndBox } from "../dotAndBox.ts";

export abstract class Tool {

    dotAndBox!: DotAndBox

    abstract get name(): string

    updateModel(dotAndBox: DotAndBox) {
        this.dotAndBox = dotAndBox
    }

    abstract click(point: Point): void

    // @ts-ignore
    move(point: Point): void {
    }

    // @ts-ignore
    up(point: Point): void {
    }
}

