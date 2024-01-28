import {Point} from "./point.ts"
import {DotsAndBoxesModel} from "./step.ts";

export abstract class Tool {

    model: DotsAndBoxesModel = new DotsAndBoxesModel('',[],[])

    updateModel(model: DotsAndBoxesModel) {
        this.model = model
    }

    abstract click(point: Point): void

    // @ts-ignore
    move(point: Point): void {
    }

    // @ts-ignore
    up(point: Point): void {
    }
}

