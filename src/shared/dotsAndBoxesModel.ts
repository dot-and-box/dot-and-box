import {Control} from "../controls/control.ts";
import {Point} from "./point.ts";
import {Step} from "./step.ts";
import {StepState} from "./stepState.ts";
import {StepDirection} from "./stepDirection.ts";
import {Easing, EasingType} from "./easingFunctions.ts";

export class DotsAndBoxesModel {
    static readonly SELECTED_PREFIX = "selected"
    title: string
    subtitle: string
    controls: Control[]
    steps: Step[]
    currentStep: Step = new Step()
    origin: Point = Point.zero()
    offset: Point = Point.zero()
    zoom: number = 1
    selectedControls: Control[] = []
    private _currentStepIndex = 0;
    private _requestedStepProgress = 0
    lastTime: any = 0
    private stepStartTime: number = 0
    public autoPlay: boolean = false
    easingFunc: (x: number) => number = Easing.getEasingByType(EasingType.IN_QUAD)
    inverseEasingFunc: (x: number) => number = Easing.getInverseEasingByType(EasingType.IN_QUAD)

    public get requestedStepProgress() {
        return this._requestedStepProgress
    }

    public set requestedStepProgress(newVal: number) {
        this._requestedStepProgress = newVal
    }

    public get currentStepIndex() {
        return this._currentStepIndex
    }

    public set currentStepIndex(newIndex: number) {
        this._currentStepIndex = newIndex
        this.currentStep = this.steps[this._currentStepIndex]
    }

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

    updateStartTime() {
        if (this.currentStep.direction == StepDirection.FORWARD) {
            this.stepStartTime = this.lastTime - (this.inverseEasingFunc(this.requestedStepProgress) * this.currentStep.duration)
        } else if (this.currentStep.direction === StepDirection.BACKWARD) {
            this.stepStartTime = this.lastTime - ((1 - this.inverseEasingFunc(this.requestedStepProgress)) * this.currentStep.duration)
        }
    }

    updateRequestedProgressIfInMove() {
        if (this.currentStep.direction != StepDirection.NONE && this.currentStep.state != StepState.STOPPED) {
            if (this.currentStep.direction === StepDirection.FORWARD) {
                this._requestedStepProgress = this.easingFunc((this.lastTime - this.stepStartTime) / this.currentStep.duration)
            } else if (this.currentStep.direction == StepDirection.BACKWARD) {
                this._requestedStepProgress = this.easingFunc((this.currentStep.duration - (this.lastTime - this.stepStartTime)) / this.currentStep.duration)
            }
            if (this._requestedStepProgress <= 0.001 || this._requestedStepProgress > 1) {
                this._requestedStepProgress = this._requestedStepProgress <= 0.001 ? 0 : 1
            }
        }
    }

    updateProgress() {
        if (this.currentStep.progress != this._requestedStepProgress) {
            this.currentStep.progress = this._requestedStepProgress
            if (this.autoPlay) {
                this.handleAutoPlay()
            }
            // here maybe something smarter...
            if (this.currentStep.state == StepState.START && this._currentStepIndex == 0){
                this.subtitle = ''
            }
        }
    }

    private handleAutoPlay() {
        if (this.currentStep.state == StepState.END && this._currentStepIndex < this.steps.length - 1) {
            this.nextStep()
        } else if (this.currentStep.state == StepState.START && this._currentStepIndex > 0) {
            this.singleBackward()
        }
    }

    togglePause() {
        this.updateStartTime()
        this.currentStep.togglePause()
        if (this.currentStep.state == StepState.STOPPED) {
            this.autoPlay = false
        }
    }

    singleForward() {
        this.nextStep()
        this.currentStep.forward()
        this.updateStartTime()
        this.currentStep.run()
    }

    singleBackward() {
        this.previousStep()
        this.currentStep.backward()
        this.updateStartTime()
        this.currentStep.run()
    }

    public selectStep(index: number) {
        this.currentStepIndex = index
    }

    public previousStep() {
        if (this.currentStep.state == StepState.START) {
            if (this._currentStepIndex > 0) {
                this.selectStep(this._currentStepIndex - 1)
                this._requestedStepProgress = 1
                this.subtitle = this.currentStep.title
            }
        }
    }

    public nextStep() {
        if (this.currentStep.state == StepState.END && this._currentStepIndex < this.steps.length - 1) {
            this.selectStep(this._currentStepIndex + 1)
            this.currentStep.init()
            this._requestedStepProgress = 0
        }
        this.currentStep.forward()
        this.updateStartTime()
        this.currentStep.run()
        this.subtitle = this.currentStep.title
    }
}