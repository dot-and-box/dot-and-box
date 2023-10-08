import {Point} from "./point.ts";
import {Control, ControlBase} from "../dot/dot.ts";

export class DotsAndBoxesModel {
    controls: ControlBase[]
    steps: Step[]
    constructor(controls: ControlBase[], steps: Step[]) {
        this.controls = controls;
        this.steps = steps;
    }
}

export interface Step {
    changes: Change[]
}

export class StepImpl {
    changes: ChangeBase[];
    finishedChanges = 0;
    public animationStep = 0.0;
    public state: StepState = StepState.START

    notifyFinished() {
        this.finishedChanges++;
        if (this.finishedChanges == this.changes.length) {
            this.state = this.animationStep > 0 ? StepState.END : StepState.START
        }
    }

    public reset() {
        this.changes.forEach(c => {
            c.finished = false
        })
        this.finishedChanges = 0

    }

    constructor() {
        this.changes = [];
    }

    //TODO refactor naming
    forward() {
        this.changes.forEach(c => c.onBeforeStateForward())
    }
}

export enum StepState {
    START,
    IN_PROGRESS,
    END
}


export enum ChangeType {
    MOVE,
    CREATE_DOT,
    CREATE_BOX
}

export interface Change {
    type: ChangeType
}

export class MoveChange implements Change {
    constructor(targetPosition: Point, controlIndex: number) {
        this.targetPosition = targetPosition;
        this.controlIndex = controlIndex;
    }

    targetPosition: Point;
    controlIndex: number
    readonly type: ChangeType = ChangeType.MOVE
}


abstract class ChangeBase {
    finished: boolean = false
    progress: number = 0
    readonly type: ChangeType

    protected constructor(type: ChangeType) {
        this.type = type
    }

    onBeforeStateForward(){

    }
}

export class Move extends ChangeBase {
    start: Point;
    end: Point
    control: Control

    constructor(end: Point, control: Control) {
        super(ChangeType.MOVE)
        this.start = control.position.clone();
        this.end = end.clone();
        this.control = control;
    }

    override onBeforeStateForward() {
        super.onBeforeStateForward();
        this.start = this.control.position.clone()
    }


}

