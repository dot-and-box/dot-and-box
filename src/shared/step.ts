import {ActionBase} from "./actionBase.ts";
import {Control} from "../controls/control.ts";
import {StepState} from "./stepState.ts";
import {StepDirection} from "./stepDirection.ts";

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
    model!: { controls: Control[] }
    public _pause = false;
    public direction = StepDirection.NONE;
    public progress = 0.0;
    public state: StepState = StepState.START
    public duration: number  = 600;


    updateState() {
        if (this.progress == 0) {
            this.state = StepState.START;
            if (this.direction == StepDirection.BACKWARD) {
                this.direction = StepDirection.NONE
                this.actions.forEach(a => a.onAfterBackward())
            }
        } else if (this.progress == 1) {
            this.state = StepState.END;
        } else {
            this.state = StepState.IN_PROGRESS;
        }
    }

    public init(model: { controls: Control[] }) {
        this.model = model;
    }

    public reset() {
        this._pause = false
    }

    constructor() {
        this.actions = [];
    }

    forward() {
        this.actions.forEach(a => a.onBeforeForward());
        this.direction = StepDirection.FORWARD
    }

    back() {
        this.direction = StepDirection.BACKWARD
    }

    get pause(): boolean {
        return this._pause || this.actions.length == 0;
    }

    set pause(pause: boolean) {
        this._pause = pause;
    }

    togglePause() {
        if (this.direction != StepDirection.NONE && this.actions.length > 0) {
            this._pause = !this._pause;
        }
    }
}



