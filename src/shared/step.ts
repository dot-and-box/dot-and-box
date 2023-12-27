import {Point} from "./point.ts";
import {Control, ControlBase} from "../dot/dotControl.ts";

export class DotsAndBoxesModel {
    title: string
    controls: ControlBase[]
    steps: Step[]
    constructor(title: string, controls: ControlBase[], steps: Step[]) {
        this.title = title;
        this.controls = controls;
        this.steps = steps;
    }
}

export interface Step {
    actions: Action[]
}

export class StepImpl {
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

    //TODO refactor naming
    forward() {
        this.actions.forEach(c => c.onBeforeStateForward())
    }
}

export enum StepState {
    START,
    IN_PROGRESS,
    END
}


export enum ActionType {
    MOVE,
    CREATE_DOT,
    CREATE_BOX
}

export interface Action {
    type: ActionType
}

export class MoveAction implements Action {
    constructor(targetPosition: Point, controlIndex: number) {
        this.targetPosition = targetPosition;
        this.controlIndex = controlIndex;
    }

    targetPosition: Point;
    controlIndex: number
    readonly type: ActionType = ActionType.MOVE
}


abstract class ActionBase {
    finished: boolean = false
    progress: number = 0
    readonly type: ActionType

    protected constructor(type: ActionType) {
        this.type = type
    }

    onBeforeStateForward(){

    }
}

export class Move extends ActionBase {
    start: Point;
    end: Point
    control: Control

    constructor(end: Point, control: Control) {
        super(ActionType.MOVE)
        this.start = control.position.clone();
        this.end = end.clone();
        this.control = control;
    }

    override onBeforeStateForward() {
        super.onBeforeStateForward();
        this.start = this.control.position.clone()
    }


}

