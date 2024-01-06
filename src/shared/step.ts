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
    model: { controls: Control[] }
    public _pause = false;
    public progressStep = 0.0;
    public progress = 0.0;

    public state: StepState = StepState.START

    updateState() {
        if (this.progress == 0) {
            this.state = StepState.START;
        } else if (this.progress == 1) {
            this.state = StepState.END;
        } else {
            this.state = StepState.IN_PROGRESS;
        }
    }

    public init(model: { controls: Control[] }) {
        this.model = model;
        this.actions.forEach(c => {
            c.step = this
        })
    }

    public reset() {
        this._pause = false
    }

    constructor() {
        this.actions = [];
    }

    forward() {
        this.actions.forEach(a=>a.onBeforeForward());
        this.progressStep = 0.01
    }

    back() {
        this.actions.forEach(a=>a.onBeforeBackward());
        this.progressStep = -0.01
    }

    get pause(): boolean {
        return this._pause || this.actions.length == 0;
    }

    set pause(pause: boolean) {
        this._pause = pause;
    }

    togglePause() {
        if (this.progressStep != 0 && this.actions.length > 0) {
            this._pause = !this._pause;
        }
    }
}

export enum StepState {
    START,
    IN_PROGRESS,
    END
}


