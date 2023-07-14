import {Point} from "./point.ts";
import {ControlBase} from "./dot.ts";

export interface DotsModel {
    controls: ControlBase[],
    steps: Step[]
}
export interface Step {
    changes: Change[]
    finished: boolean
    direction: Direction
}

export enum Direction {
    FORWARD,
    BACKWARD
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