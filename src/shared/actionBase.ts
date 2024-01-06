import {Step} from "./step.ts";

export abstract class ActionBase {
    step: Step

    onBeforeForward(): void {}

    onBeforeBackward(): void{}

    updateValue(progress: number): void{}

}