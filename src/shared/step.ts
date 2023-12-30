import {Control} from "../dot/dotControl.ts";
import {ActionBase} from "./actionBase.ts";

export class DotsAndBoxesModel {
    title: string
    controls: Control[]
    steps: Step[]

    constructor(title: string, controls: Control[], steps: Step[]) {
        this.title = title;
        this.controls = controls;
        this.steps = steps;
    }
}

export class Step {
    actions: ActionBase[];
    finishedChanges = 0;
    public animationStep = 0.0;
    public state: StepState = StepState.START

    notifyFinished() {
        this.finishedChanges++;
        if (this.finishedChanges == this.actions.length) {
            this.state = this.animationStep > 0 ? StepState.END : StepState.START
        }
    }

    public reset() {
        this.actions.forEach(c => {
            c.finished = false
        })
        this.finishedChanges = 0

    }

    constructor() {
        this.actions = [];
    }

    forward() {
        this.actions.forEach(c => c.onBeforeStateForward())
    }
}

export enum StepState {
    START,
    IN_PROGRESS,
    END
}


