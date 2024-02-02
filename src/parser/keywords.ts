import {TokenType} from "./tokenType.ts"

export class Keywords {
    private static KEYWORDS_MAP = new Map<string, TokenType>([
        [TokenType.ID.toString(), TokenType.ID],
        [TokenType.TRUE.toString(), TokenType.TRUE],
        [TokenType.FALSE.toString(), TokenType.FALSE],
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
        [TokenType.SELECTED.toString(), TokenType.SELECTED],
        [TokenType.VISIBLE.toString(), TokenType.VISIBLE]
    ])

    public static ASSIGN_PROPERTIES = [TokenType.SELECTED, TokenType.TEXT, TokenType.VISIBLE, TokenType.STRING]

    public static isKeyword(tokenName: string): boolean {
        return this.KEYWORDS_MAP.has(tokenName)
    }

    public static getKeywordByName(tokenName: string): TokenType | undefined {
        return this.KEYWORDS_MAP.get(tokenName)
    }

}