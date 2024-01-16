export class Change {
    controlIds: string[]
    property: string
    newValue: any
    oldValue: any

    constructor(controlIds: string[], property: string, newValue: any, oldValue: any) {
        this.controlIds = controlIds
        this.property = property
        this.newValue = newValue
        this.oldValue = oldValue
    }
}