import {Point} from "./point.ts";
import {Control, ControlBase} from "./dot.ts";

export interface DotsModel {
    controls: ControlBase[],
    steps: Step[]
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
    updateChanges() {
        this.changes.forEach(c => c.onStateStart())
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
    CREATE_COMPONENT
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

    onStateStart(){

    }
}

export class Move extends ChangeBase {
    start: Point;
    end: Point
    control: Control

    constructor(start: Point, end: Point, control: Control) {
        super(ChangeType.MOVE)
        this.start = start.clone();
        this.end = end.clone();
        this.control = control;
    }

    override onStateStart() {
        super.onStateStart();
        this.start = this.control.position.clone()
    }


}

