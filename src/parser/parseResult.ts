import {DotsAndBoxesModel} from "../shared/step.ts";


export class ParseResult {
    success: boolean
    result: DotsAndBoxesModel
    errors: string[]

    constructor() {
        this.errors = []
        this.errors = []
        this.success = true
        this.result = new DotsAndBoxesModel([],[])
    }
}