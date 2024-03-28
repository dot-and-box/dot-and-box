import {EMPTY_TOOL} from "../shared/elemConstants.ts";
import {Tool} from "../shared/tool.ts";

export class EmptyTool extends Tool {

    public static NAME: string = ""

    // @ts-ignore
    override click(point: Point): void {
    }

    // @ts-ignore
    override move(movePoint: Point) {

    }

    get name(): string {
        return EMPTY_TOOL
    }

}