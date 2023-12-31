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
    public _pause = false;
    public animationStep = 0.0;
    public state: StepState = StepState.START

    notifyFinished() {
        this.finishedChanges++;
        if (this.finishedChanges == this.actions.length) {
            this.state = this.animationStep > 0 ? StepState.END : StepState.START
        }
    }

    public reset() {
        this._pause = false
        this.actions.forEach(c => {
            c.finished = false
        })
        this.finishedChanges = 0
    }

    constructor() {
        this.actions = [];
    }

    forward() {
        this.animationStep = 0.01
    }

    back() {
        this.animationStep = -0.01
    }

    get pause(): boolean {
        return this._pause || this.actions.length == 0;
    }

    set pause(pause: boolean) {
        this._pause = pause;
    }

    togglePause() {
        if (this.animationStep != 0 && this.actions.length > 0) {
            this._pause = !this._pause;
        }
    }
}

export enum StepState {
    START,
    IN_PROGRESS,
    END
}


