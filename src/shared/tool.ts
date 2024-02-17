import {Point} from "./point.ts"
import {DotsAndBoxes} from "../dotsAndBoxes.ts";

export abstract class Tool {

    dotsAndBoxes!: DotsAndBoxes

    updateModel(dotsAndBoxes: DotsAndBoxes) {
        this.dotsAndBoxes = dotsAndBoxes
    }

    abstract click(point: Point): void

    // @ts-ignore
    move(point: Point): void {
    }

    // @ts-ignore
    up(point: Point): void {
    }
}

