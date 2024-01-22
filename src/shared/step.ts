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
    public direction = StepDirection.NONE;
    public progress = 0.0;
    public state: StepState = StepState.START
    public duration: number = 600;


    updateState() {
        if (this.progress == 0) {
            this.state = StepState.START;
            if (this.direction == StepDirection.BACKWARD) {
                this.direction = StepDirection.NONE
                this.actions.forEach(a => a.onAfterBackward())
            }
        } else if (this.progress == 1) {
            this.state = StepState.END;
            if (this.direction == StepDirection.FORWARD) {
                this.direction = StepDirection.NONE
            }
        } else {
            this.state = StepState.IN_PROGRESS;
        }
    }

    public init(model: { controls: Control[] }) {
        this.model = model;
    }

    public unpause() {
        if (this.direction != StepDirection.NONE) {
            this.state = StepState.IN_PROGRESS
        }
    }

    constructor() {
        this.actions = [];
    }

    forward() {
        if (this.state != StepState.END) {
            this.actions.forEach(a => a.onBeforeForward());
            this.direction = StepDirection.FORWARD
            this.state = StepState.IN_PROGRESS
        }
    }

    back() {
        if (this.state != StepState.START) {
            this.direction = StepDirection.BACKWARD
            this.state = StepState.IN_PROGRESS
        }
    }

    togglePause() {
        if (this.direction != StepDirection.NONE) {
            this.state = this.state == StepState.STOPPED
                ? StepState.IN_PROGRESS
                : StepState.STOPPED
        }
    }
}



