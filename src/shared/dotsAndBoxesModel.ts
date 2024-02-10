import {Control} from "../controls/control.ts";
import {Point} from "./point.ts";
import {Step} from "./step.ts";

export class DotsAndBoxesModel {
    title: string
    controls: Control[]
    steps: Step[]
    origin: Point = Point.zero()
    offset: Point = Point.zero()
    zoom: number = 1
    static readonly SELECTED_PREFIX = "selected"
    selectedControls: Control[] = []

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