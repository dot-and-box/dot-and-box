import {Point} from "./point.ts";

export interface Step {
    duration: number
    actions: Action[]
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