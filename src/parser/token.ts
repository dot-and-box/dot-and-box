import {TokenType} from "./tokenType.ts";

export class Token {
    tokenType: TokenType
    value: string

    constructor(tokenType: TokenType, value?: string) {
        this.tokenType = tokenType;
        this.value = value ? value : "";
    }


}