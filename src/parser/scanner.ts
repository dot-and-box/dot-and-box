import { TokenType } from "./tokenType.ts"
import { Token } from "./token.ts"
import { Keywords } from "./keywords.ts"

export class Scanner {
    start: number = 0
    position = 0
    line = 1
    tokens: Token[] = []
    source = ''

    public scan(source: string): Token[] {
        this.source = source
        while (this.position < source.length) {
            const c = this.advance()
            switch (c) {
                case ' ':
                case '\r':
                    break
                case '\n':
                    this.addToken(TokenType.NEW_LINE)
                    this.line++
                    break
                case '\t':
                    break
                case '(':
                    this.addToken(TokenType.LEFT_BRACKET)
                    break
                case ')':
                    this.addToken(TokenType.RIGHT_BRACKET)
                    break
                case '[':
                    this.addToken(TokenType.LEFT_SQUARE_BRACKET)
                    break
                case ']':
                    this.addToken(TokenType.RIGHT_SQUARE_BRACKET)
                    break
                case ':':
                    this.addToken(TokenType.COLON)
                    break
                case ',':
                    this.addToken(TokenType.COMMA)
                    break
                case '<':
                    if (!this.matchSwap())
                        this.addToken(TokenType.LESS_THAN)
                    break
                case '*':
                    if (!this.matchClone())
                        this.addToken(TokenType.ASTERIX)
                    break
                case '+':
                    if (!this.matchResize())
                        this.addToken(TokenType.PLUS)
                    break
                case '-':
                    if (this.match('>'))
                        this.addToken(TokenType.MOVE)
                    else
                        this.addToken(TokenType.MINUS)
                    break
                case '=':
                    this.addToken(TokenType.EQUALS)
                    break
                case '>':
                    this.addToken(TokenType.GREATER_THAN)
                    break
                case '/':
                    if (this.match('/')) {
                        while (this.peek() != '\n' && !this.isAtEnd())
                            this.advance()
                    }
                    break
                case "'":
                    this.string()
                    break
                default:
                    if (this.isDigit(c)) {
                        this.number()
                    } else if (this.isAlpha(c)) {
                        this.identifier()
                    } else {
                        throw new Error(`line: ${this.line} Unexpected character ${c} charcode: ${c.charCodeAt(0)}`)
                    }
            }
            this.start = this.position
        }
        return this.tokens
    }

    matchSwap(): boolean {
        if (this.match("-")) {
            if (this.match(">")) {
                this.addToken(TokenType.SWAP)
                return true
            } else {
                this.addToken(TokenType.ASSIGN)
                return true
            }
        }

        return false
    }

    matchClone(): boolean {
        if (this.match("-"))
            if (this.match(">")) {
                this.addToken(TokenType.CLONE)
                return true
            }
        return false
    }

    matchResize(): boolean {
        if (this.match("-"))
            if (this.match(">")) {
                this.addToken(TokenType.RESIZE)
                return true
            }
        return false
    }

    addToken(tokenType: TokenType) {
        this.addTokenValue(tokenType)
    }

    addTokenValue(tokenType: TokenType, value?: string) {
        this.tokens.push(new Token(this.start, tokenType, value))
    }

    advance(): string {
        return this.source.charAt(this.position++)
    }

    isAtEnd() {
        return this.position >= this.source.length
    }

    peek(): string {
        return this.isAtEnd() ? '\0' : this.source.charAt(this.position)
    }

    match(expected: string) {
        if (this.isAtEnd()) return false
        if (this.source.charAt(this.position) != expected) {
            return false
        }
        this.position++
        return true
    }

    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9'
    }

    private isDigitOrDot(c: string): boolean {
        return this.isDigit(c) || c == '.'
    }

    private number() {
        while (this.isDigitOrDot(this.peek())) {
            this.advance()
        }
        let val = this.source.substring(this.start, this.position)
        this.addTokenValue(TokenType.NUMBER, val)
    }

    isAlpha(c: string): boolean {
        const alphaRegExp = /[\p{Letter}\p{Mark}]+/gu
        return alphaRegExp.test(c) || c == '_'
    }

    isAlphanumeric(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c)
    }

    string() {
        while (this.peek() != "'" && !this.isAtEnd()) {
            if (this.peek() == '\n') this.line++
            this.advance()
        }

        if (this.isAtEnd()) {
            throw new Error(`line: ${this.line} Unterminated String`)
        }

        this.advance()

        let val = this.source.substring(this.start + 1, this.position - 1)
        this.addTokenValue(TokenType.STRING, val)
    }

    identifier() {
        while (this.isAlphanumeric(this.peek()))
            this.advance()
        let val = this.source.substring(this.start, this.position)
        const tokenType = Keywords.isKeyword(val)
            ? Keywords.getKeywordByName(val)
            : TokenType.IDENTIFIER
        this.addTokenValue(tokenType!, val)
    }

}
