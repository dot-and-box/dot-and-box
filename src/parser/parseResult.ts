import {DotsModel} from "../step.ts";


export class ParseResult {
    success: boolean
    result: DotsModel
    errors: string[]

    constructor() {
        this.errors = []
        this.errors = []
        this.success = true
        this.result = new DotsModel([],[])
    }
}