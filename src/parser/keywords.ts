import {TokenType} from "./tokenType.ts";

export class Keywords {
    private static KEYWORDS_MAP = new Map<string, TokenType>([
        [TokenType.ID.toString(), TokenType.ID],
        [TokenType.DOT.toString(), TokenType.DOT],
        [TokenType.DOTS.toString(), TokenType.DOTS],
        [TokenType.TITLE.toString(), TokenType.TITLE],
        [TokenType.TEXT.toString(), TokenType.TEXT],
        [TokenType.BOX.toString(), TokenType.BOX],
        [TokenType.AT.toString(), TokenType.AT],
        [TokenType.SIZE.toString(), TokenType.SIZE],
        [TokenType.COLOR.toString(), TokenType.COLOR],
        [TokenType.DATA.toString(), TokenType.DATA],
        [TokenType.STEPS.toString(), TokenType.STEPS],
    ]);

    public static isKeyword(tokenName: string): boolean {
        return this.KEYWORDS_MAP.has(tokenName)
    }

    public static getKeywordByName(tokenName: string): TokenType {
        return this.KEYWORDS_MAP.get(tokenName)
    }

}