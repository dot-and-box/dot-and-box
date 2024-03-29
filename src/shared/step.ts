import {ActionBase} from "./actionBase.ts"
import {StepState} from "./stepState.ts"
import {StepDirection} from "./stepDirection.ts"

export class Sequence {
    private _progress = 0.0
    public actions: ActionBase[] = []
    public _start: number = 0
    public _end: number = 1
    public instant: boolean = true
    private _startEndDiff: number = 1

    public get start() {
        return this._start
    }

    public get end() {
        return this._end
    }

    calcDiff() {
        this._startEndDiff = this._end - this._start
    }

    public addAction(action: ActionBase) {
        this.instant &&= action.instant
        this.actions.push(action)
    }

    public constructor(start: number, end: number) {
        this._start = start
        this._end = end
        this.calcDiff()
    }

    public updateStartEnd(start: number, end: number) {
        this._start = start;
        this._end = end;
        this.calcDiff()
    }

    public set progress(newGlobalProgress: number) {
        let newProgress
        if (newGlobalProgress <= this.start) {
            newProgress = 0
        } else if (newGlobalProgress >= this.end) {
            newProgress = 1
        } else {
            newProgress = this._startEndDiff > 0 ? (newGlobalProgress - this.start) / this._startEndDiff : 1;
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
    sequences: Sequence[] = []
    title: string = ''
    private _progress = 0.0
    public direction = StepDirection.NONE
    public state: StepState = StepState.START
    public duration: number = 1000

    init() {
        this.sequences.forEach(a => a.init())
    }

    public addParallelAction(action: ActionBase) {
        if (this.sequences.length == 0) {
            this.sequences.push(new Sequence(0, 1));
        }
        this.sequences[this.sequences.length - 1].addAction(action)
    }

    public addSequentialAction(action: ActionBase) {
        let nonInstantSequenceCount = this
            .sequences
            .reduce((acc: number, curr: Sequence) => acc + (curr.instant ? 0 : 1), 0) + (action.instant ? 0 : 1)

        const sequenceSpan = 1 / nonInstantSequenceCount;
        let currentStart = 0;
        for (const seq of this.sequences) {
            if (seq.instant) {
                seq.updateStartEnd(currentStart, currentStart)
            } else {
                seq.updateStartEnd(currentStart, currentStart + sequenceSpan)
                currentStart += sequenceSpan
            }
        }
        this.sequences.push(new Sequence(1 - sequenceSpan, 1));
        this.sequences[this.sequences.length - 1].addAction(action)
    }

    public get progress() {
        return this._progress
    }

    public set progress(newProgress: number) {
        if (newProgress == this._progress)
            return
        this._progress = newProgress

        this.sequences.forEach(ag => ag.progress = this._progress)
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
