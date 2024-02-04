import {ActionBase} from "../shared/actionBase.ts"
import {DotsAndBoxesModel} from "../shared/step.ts"
import {Control} from "../controls/control.ts"
import {Change} from "../shared/change.ts"
import {PropertyChange} from "../shared/propertyChange.ts";
import {DUMMY_CONTROL} from "../shared/constants.ts";

export class Assign extends ActionBase {

    control: Control | undefined = DUMMY_CONTROL
    controlId: string
    properties: Map<string, any>
    change: Change
    applied = false

    constructor(model: DotsAndBoxesModel, controlId: string, properties: Map<string, any>) {
        super(model)
        this.controlId = controlId
        this.change = new Change(this.controlId, [])
        this.properties = properties
    }

    override init() {
        super.init()
        this.selectControls()
    }

    selectControls() {
        this.control = this.model.findControl(this.controlId)
    }

    override onBeforeForward() {
        super.onBeforeForward()
        this.selectControls()
        this.applyChanges()
    }

    override onAfterBackward() {
        super.onAfterBackward();
        this.revertChanges()
    }

    applyChanges(): void {
        if (!this.applied && this.control) {
            this.applied = true
            let control = this.control as any
            let propertyChanges = []
            for (const p of this.properties.keys()) {
                const oldValue = control[p]
                const newValue = this.properties.get(p)
                control[p] = newValue
                propertyChanges.push(new PropertyChange(p, newValue, oldValue))
            }
            this.change = new Change(this.controlId, propertyChanges)
        }
    }

    revertChanges(): void {
        if (this.applied && this.control) {
            this.applied = false
            let control = this.control as any
            for (const propertyChange of this.change.propertyChanges) {
                control[propertyChange.property] = propertyChange.oldValue
            }
            this.change = new Change(this.controlId, [])
        }
    }

    // @ts-ignore
    override updateValue(progress: number) {
    }

}
