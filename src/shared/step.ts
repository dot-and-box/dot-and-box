import {ActionBase} from "./actionBase.ts"
import {StepState} from "./stepState.ts"
import {StepDirection} from "./stepDirection.ts"

export class ActionGroup {
    private _progress = 0.0
    public actions: ActionBase[] = []
    public start: number = 0
    public end: number = 1
    private _startEndDiff: number = this.end - this.start

    public constructor(start: number, end: number) {
        this.start = start
        this.end = end
    }

    public set progress(newGlobalProgress: number) {
        let newProgress
        if (newGlobalProgress <= this.start) {
            newProgress = 0
        } else if (newGlobalProgress >= this.end) {
            newProgress = 1
        } else {
            newProgress = (newGlobalProgress - this.start) / this._startEndDiff;
        }
        if (this._progress === newProgress) {
            return
        }

        if (newProgress > 0 && this._progress == 0) {
            this.actions.forEach(a => a.onBeforeForward())
        } else if (newProgress == 0 && this._progress > 0) {
            this.actions.forEach(a => a.onAfterBackward())
        }
        this._progress = newProgress
        for (const action of this.actions) {
            action.updateValue(this._progress)
        }
    }

    public get progress() {
        return this._progress
    }

    init() {
        this.actions.forEach(a => a.init())
    }

}

export class Step {
    actionGroups: ActionGroup[] = []
    private _progress = 0.0
    public direction = StepDirection.NONE
    public state: StepState = StepState.START
    public duration: number = 1000

    init() {
        this.actionGroups.forEach(a => a.init())
    }

    public addParallelAction(action: ActionBase) {
        if (this.actionGroups.length == 0) {
            this.actionGroups.push(new ActionGroup(0, 1));
        }
        this.actionGroups[this.actionGroups.length - 1].actions.push(action)
    }

    public get progress() {
        return this._progress
    }

    public set progress(newProgress: number) {
        if (newProgress == this._progress)
            return
        this._progress = newProgress

        this.actionGroups.forEach(ag => ag.progress = this._progress)
        this.updateState()
    }

    updateState() {
        if (this._progress == 0) {
            this.state = StepState.START
            if (this.direction == StepDirection.BACKWARD) {
                this.direction = StepDirection.NONE
            }
        } else if (this._progress == 1) {
            this.state = StepState.END
            if (this.direction == StepDirection.FORWARD) {
                this.direction = StepDirection.NONE
            }
        } else {
            this.state = StepState.IN_PROGRESS
        }
    }

    public pause() {
        if (this.state == StepState.IN_PROGRESS) {
            this.state = StepState.STOPPED
        }
    }

    public unpause() {
        if (this.state == StepState.STOPPED) {
            this.state = StepState.IN_PROGRESS
        }
    }

    togglePause() {
        if (this.state == StepState.IN_PROGRESS) {
            this.pause()
        } else {
            this.unpause()
        }
    }

    public run() {
        if (this.direction != StepDirection.NONE) {
            this.state = StepState.IN_PROGRESS
        }
    }

    public forward() {
        if (this.state != StepState.END) {
            this.direction = StepDirection.FORWARD
            this.state = StepState.IN_PROGRESS
        }
    }

    public backward() {
        if (this.state != StepState.START) {
            this.direction = StepDirection.BACKWARD
            this.state = StepState.IN_PROGRESS
        }
    }

}
