import {TokenType} from "./tokenType.ts";

export class Token {
    position: number
    tokenType: TokenType
    value: string

    constructor(position: number, tokenType: TokenType, value?: string) {
        this.position = position;
        this.tokenType = tokenType;
        this.value = value ? value : "";
    }

    public override toString() {
        return TokenType[this.tokenType]
    }


}