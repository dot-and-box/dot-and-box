import {TokenType} from "./tokenType.ts";

export class Keywords {
    private static KEYWORDS_MAP = new Map<string, TokenType>([
        [TokenType.DOTS.toString(), TokenType.DOTS],
        [TokenType.TITLE.toString(), TokenType.TITLE],
        [TokenType.BOXES.toString(), TokenType.BOXES],
        [TokenType.AT.toString(), TokenType.AT],
        [TokenType.DATA.toString(), TokenType.DATA],
        [TokenType.ANIMATE.toString(), TokenType.ANIMATE],
    ]);

    public static isKeyword(tokenName: string): boolean {
        return this.KEYWORDS_MAP.has(tokenName)
    }

    public static getKeywordByName(tokenName: string): TokenType {
        return this.KEYWORDS_MAP.get(tokenName)
    }

}