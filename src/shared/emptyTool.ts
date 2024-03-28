import {Tool} from "./tool.ts"
import {Point} from "./point.ts"

export class EmptyTool extends Tool {

    public static NAME: string = "empty-tool"

    // @ts-ignore
    override click(point: Point): void {
    }

    // @ts-ignore
    override move(movePoint: Point) {

    }

    get name(): string {
        return EmptyTool.NAME;
    }

}