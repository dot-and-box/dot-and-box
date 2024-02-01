export class PropertyChange {
    property: string
    newValue: any
    oldValue: any

    constructor(property: string, newValue: any, oldValue: any) {
        this.property = property
        this.newValue = newValue
        this.oldValue = oldValue
    }
}