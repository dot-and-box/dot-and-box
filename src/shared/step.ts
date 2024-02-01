import {ActionBase} from "./actionBase.ts"
import {Control} from "../controls/control.ts"
import {StepState} from "./stepState.ts"
import {StepDirection} from "./stepDirection.ts"
import {Point} from "./point.ts";

export class DotsAndBoxesModel {
    title: string
    controls: Control[]
    steps: Step[]
    origin: Point = Point.zero()
    offset: Point = Point.zero()
    zoom: number = 1
    static readonly SELECTED_PREFIX = "selected"
    selectedControls = []

    constructor(title: string, controls: Control[], steps: Step[]) {
        this.title = title
        this.controls = controls
        this.steps = steps
        this.origin = Point.zero()
    }

    changeSelected(controls: Control[]) {
        controls.forEach(control => {
            control.selected = !control.selected
            if (control.selected) {
                this.selectedControls.push(control)
            } else {
                const foundIndex = this.selectedControls.indexOf(control)
                if (foundIndex >= 0) {
                    this.selectedControls.splice(foundIndex, 1)
                }
            }
        })

    }

    deleteSelected() {
        this.controls = this.controls.filter(c => !c.selected)
    }

    findControl(controlId: string) {
        if (controlId.startsWith(DotsAndBoxesModel.SELECTED_PREFIX)) {
            const index = parseInt(controlId.substring(DotsAndBoxesModel.SELECTED_PREFIX.length), 10)
            return index < this.selectedControls.length ? this.selectedControls[index] : undefined
        } else {
            return this.controls.find(c => c.id == controlId)
        }
    }
}

export class Step {
    actions: ActionBase[] = []
    private _progress = 0.0
    public direction = StepDirection.NONE
    public state: StepState = StepState.START
    public duration: number = 1000

    init() {
        this.actions.forEach(a => a.init())
    }

    public get progress() {
        return this._progress
    }

    public set progress(newProgress: number) {
        if (newProgress == this._progress)
            return
        if (newProgress > 0 && this._progress == 0) {
            this.actions.forEach(a => a.onBeforeForward())
        } else if (newProgress == 0 && this._progress > 0) {
            this.actions.forEach(a => a.onAfterBackward())
        }
        this._progress = newProgress
        for (const action of this.actions) {
            action.updateValue(this._progress)
        }
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

    public unpause() {
        if (this.direction != StepDirection.NONE) {
            this.state = StepState.IN_PROGRESS
        }
    }

    forward() {
        if (this.state != StepState.END) {
            this.direction = StepDirection.FORWARD
            this.state = StepState.IN_PROGRESS
        }
    }

    backward() {
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



