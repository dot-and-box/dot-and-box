import {DotsAndBoxesModel} from "./step.ts"

export abstract class ActionBase {
    model: DotsAndBoxesModel

    protected constructor(model: DotsAndBoxesModel) {
        this.model = model
    }

    init(): void {}

    onBeforeForward(): void {}

    onAfterBackward(): void{}

    abstract updateValue(progress: number): void

}