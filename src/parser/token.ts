import {TokenType} from "./tokenType.ts";

export class Token {
    position: number
    type: TokenType
    value: string

    constructor(position: number, tokenType: TokenType, value?: string) {
        this.position = position;
        this.type = tokenType;
        this.value = value ? value : "";
    }

}