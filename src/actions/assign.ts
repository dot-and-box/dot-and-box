import {ActionBase} from "../shared/actionBase.ts"
import {Control} from "../controls/control.ts"
import {PropertyChange} from "../shared/propertyChange.ts";
import {DotAndBoxModel} from "../shared/dotAndBoxModel.ts";

export class Assign extends ActionBase {

    controls: Control [] = []
    controlId: string
    properties: Map<string, any>
    changes: Map<string, PropertyChange[]> = new Map<string, PropertyChange[]>()
    applied = false

    constructor(model: DotAndBoxModel, controlId: string, properties: Map<string, any>) {
        super(model)
        this.controlId = controlId
        this.properties = properties
    }

    override init() {
        super.init()
        this.selectControls()
    }

    selectControls() {
        this.controls = this.model.findControls(this.controlId)
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
            for (const control of this.controls) {
                let ctrl = control as Control
                let propertyChanges = []
                for (const p of this.properties.keys()) {
                    const oldValue = control.getPropertyValue(p)
                    const newValue = this.properties.get(p)
                    ctrl.setPropertyValue(p, newValue)
                    propertyChanges.push(new PropertyChange(p, newValue, oldValue))
                    if (p === 'selected') {
                        this.model.applySelected([ctrl])
                    }
                }
                this.changes.set(ctrl.id, propertyChanges)
            }
        }
    }

    revertChanges(): void {
        if (this.applied) {
            this.applied = false
            for (const control of this.controls) {
                let ctrl : any = control as any
                let changes = this.changes.get(control.id)
                if(changes){
                for (const propertyChange of changes) {
                    ctrl[propertyChange.property] = propertyChange.oldValue
                }
                }
            }
            this.changes = new Map<string, PropertyChange[]>()
        }
    }

    // @ts-ignore
    override updateValue(progress: number) {
    }


}
