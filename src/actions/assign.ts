import {ActionBase} from "../shared/actionBase.ts"
import {DotsAndBoxesModel} from "../shared/step.ts"
import {Control} from "../controls/control.ts"
import {Change} from "../shared/change.ts"

export class Assign extends ActionBase {

    controls: Control[] = []
    controlIds: string []
    properties: Map<string, any>
    changes: Change[] = []
    applied = false

    constructor(model: DotsAndBoxesModel, controlIds: string[], properties: Map<string, any>) {
        super(model)
        this.controlIds = controlIds
        this.properties = properties
    }

    override init() {
        super.init()
        this.selectControls()
    }

    selectControls() {
        this.controls = []
        const foundControl = this.model.controls.find(c => this.controlIds.includes(c.id))
        if (foundControl) {
            this.controls.push(foundControl)
        }
    }

    override onBeforeForward() {
        super.onBeforeForward()
        this.selectControls()
        this.applyChanges()
    }

    override  onAfterBackward() {
        super.onAfterBackward();
        this.revertChanges()
    }

    applyChanges(): void {
        if(!this.applied) {
            this.applied = true
            this.controls.forEach((c: any) => {
                for (const p of this.properties.keys()) {
                    const oldValue = c[p]
                    const newValue = this.properties.get(p)
                    c[p] = newValue
                    this.changes.push(new Change(this.controlIds, p, newValue, oldValue))
                }
            })
        }
    }

    revertChanges(): void {
        if (this.applied) {
            this.applied = false
            for (const change of this.changes) {
                this.controls.forEach((c: any) => c[change.property] = change.oldValue)
            }
            this.changes = []
        }
    }

    // @ts-ignore
    override updateValue(progress: number) {
    }

}
