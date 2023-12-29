import {Action} from "./action.ts";
import {ActionType} from "./actionType.ts";

export abstract class ActionBase implements Action {
    finished: boolean = false
    progress: number = 0
    readonly type: ActionType

    protected constructor(type: ActionType) {
        this.type = type
    }

    onBeforeStateForward() {

    }
}