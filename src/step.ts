import {Point} from "./point.ts";
import {ControlBase} from "./dot.ts";

export interface DotsModel {
    controls: ControlBase[],
    steps: Step[]
}
export interface Step {
    duration: number
    actions: Action[]
    finished: boolean
    direction: Direction
}

export enum Direction {
    FORWARD,
    BACKWARD
}


export enum ActionType {
    MOVE,
    CREATE_DOT,
    CREATE_COMPONENT
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