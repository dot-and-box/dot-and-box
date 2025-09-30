import { TokenType } from "./tokenType.ts"

export class Keywords {
    private static KEYWORDS_MAP = new Map<string, TokenType>([
        [TokenType.ID.toString(), TokenType.ID],
        [TokenType.GROUP.toString(), TokenType.GROUP],
        [TokenType.TRUE.toString(), TokenType.TRUE],
        [TokenType.FALSE.toString(), TokenType.FALSE],
        [TokenType.DOT.toString(), TokenType.DOT],
        [TokenType.DOTS.toString(), TokenType.DOTS],
        [TokenType.BOXES.toString(), TokenType.BOXES],
        [TokenType.TITLE.toString(), TokenType.TITLE],
        [TokenType.TEXT.toString(), TokenType.TEXT],
        [TokenType.BOX.toString(), TokenType.BOX],
        [TokenType.LINE.toString(), TokenType.LINE],
        [TokenType.AT.toString(), TokenType.AT],
        [TokenType.END.toString(), TokenType.END],
        [TokenType.SIZE.toString(), TokenType.SIZE],
        [TokenType.RADIUS.toString(), TokenType.RADIUS],
        [TokenType.SPAN.toString(), TokenType.SPAN],
        [TokenType.FONT_SIZE.toString(), TokenType.FONT_SIZE],
        [TokenType.WIDTH.toString(), TokenType.WIDTH],
        [TokenType.COLOR.toString(), TokenType.COLOR],
        [TokenType.COLORS.toString(), TokenType.COLORS],
        [TokenType.IDS.toString(), TokenType.IDS],
        [TokenType.STEP.toString(), TokenType.STEP],
        [TokenType.DURATION.toString(), TokenType.DURATION],
        [TokenType.SELECTED.toString(), TokenType.SELECTED],
        [TokenType.VISIBLE.toString(), TokenType.VISIBLE],
        [TokenType.LAYOUT.toString(), TokenType.LAYOUT]
    ])

    public static ASSIGN_PROPERTIES = [TokenType.SELECTED, TokenType.TEXT, TokenType.COLOR, TokenType.VISIBLE, TokenType.STRING]

    public static isKeyword(tokenName: string): boolean {
        return this.KEYWORDS_MAP.has(tokenName)
    }

    public static getKeywordByName(tokenName: string): TokenType | undefined {
        return this.KEYWORDS_MAP.get(tokenName)
    }

}
