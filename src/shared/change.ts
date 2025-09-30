import { PropertyChange } from "./propertyChange.ts";

export class Change {
  controlId: string
  propertyChanges: PropertyChange[]

  constructor(controlIds: string, propertyChanges: PropertyChange[]) {
    this.controlId = controlIds
    this.propertyChanges = propertyChanges
  }
}
