import {Step} from "./step.ts";

export abstract class ActionBase {
    step: Step

    protected constructor(step: Step) {
        this.step = step
    }

    onBeforeForward(): void {}

    onPreviousStep(): void{}

    abstract updateValue(progress: number): void

}