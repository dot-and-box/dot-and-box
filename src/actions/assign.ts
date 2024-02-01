import {ActionBase} from "../shared/actionBase.ts"
import {DotsAndBoxesModel} from "../shared/step.ts"
import {Control, DUMMY_CONTROL} from "../controls/control.ts"
import {Change} from "../shared/change.ts"
import {PropertyChange} from "../shared/propertyChange.ts";

export class Assign extends ActionBase {

    control: Control = DUMMY_CONTROL
    controlId: string
    properties: Map<string, any>
    change: Change = new Change(this.controlId, [])
    applied = false

    constructor(model: DotsAndBoxesModel, controlId: string, properties: Map<string, any>) {
        super(model)
        this.controlId = controlId
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
        if (!this.applied) {
            this.applied = true
            let propertyChanges = []
            for (const p of this.properties.keys()) {
                const oldValue = this.control[p]
                const newValue = this.properties.get(p)
                this.control[p] = newValue
                propertyChanges.push(new PropertyChange(p, newValue, oldValue))
            }
            this.change = new Change(this.controlId, propertyChanges)
        }
    }

    revertChanges(): void {
        if (this.applied) {
            this.applied = false
            for (const propertyChange of this.change.propertyChanges) {
                this.control[propertyChange.property] = propertyChange.oldValue
            }
            this.change = new Change(this.controlId, [])
        }
    }

    // @ts-ignore
    override updateValue(progress: number) {
    }

}
