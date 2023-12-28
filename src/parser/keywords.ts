import {TokenType} from "./tokenType.ts";

export class Keywords {
    private static KEYWORDS_MAP = new Map<string, TokenType>([
        [TokenType.DOTS.toString(), TokenType.DOTS],
        [TokenType.TITLE.toString(), TokenType.TITLE],
        [TokenType.NAME.toString(), TokenType.NAME],
        [TokenType.BOX.toString(), TokenType.BOX],
        [TokenType.AT.toString(), TokenType.AT],
        [TokenType.SIZE.toString(), TokenType.SIZE],
        [TokenType.DATA.toString(), TokenType.DATA],
        [TokenType.ACTIONS.toString(), TokenType.ACTIONS],
    ]);

    public static isKeyword(tokenName: string): boolean {
        return this.KEYWORDS_MAP.has(tokenName)
    }

    public static getKeywordByName(tokenName: string): TokenType {
        return this.KEYWORDS_MAP.get(tokenName)
    }

}