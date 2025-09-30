import { DotAndBoxModel } from "./dotAndBoxModel.ts";

export abstract class ActionBase {
    model: DotAndBoxModel

    protected constructor(model: DotAndBoxModel) {
        this.model = model
    }

    init(): void {
    }

    onBeforeForward(): void {
    }

    onAfterBackward(): void {
    }

    abstract updateValue(progress: number): void

}
