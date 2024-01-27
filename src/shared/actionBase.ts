import {Step} from "./step.ts"

export abstract class ActionBase {
    step: Step

    protected constructor(step: Step) {
        this.step = step
    }

    init(): void {}

    onBeforeForward(): void {}

    onAfterBackward(): void{}

    abstract updateValue(progress: number): void

}