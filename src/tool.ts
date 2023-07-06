import {Point} from "./point.ts";

export interface Tool {
    click(point: Point): void
}

