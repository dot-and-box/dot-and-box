import {Tool} from "./tool.ts";
import {Point} from "./point.ts";

export class EmptyTool extends Tool {

    // @ts-ignore
    override click(point: Point): void {
    }

    // @ts-ignore
    override move(movePoint: Point) {

    }

}