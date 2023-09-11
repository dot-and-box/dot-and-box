import {TokenType} from "./tokenType.ts";
import {Token} from "./token.ts";

export class Parser {
    position = 0;
    line = 1;
    tokens: Token[] = [];
    source = ''

    public parse(source: string) {
        const tokens = []
        let buffer = []
        while (this.position < source.length) {
            const c = this.advance()
            switch (c) {
                case ' ':
                case '\r':
                case '\t':
                    break;
                case ':':
                    tokens.push(new Token(TokenType.COLON))
                    break;
                case ',':
                    tokens.push(new Token(TokenType.COMMA))
                    break;
                default:
                    buffer.push(c)
            }

        }
    }

    advance(): string {
        return this.source.charAt(this.position++)
    }
    peek(): string {
        return this.source.charAt(this.position)
    }

    private identifier(data: string[]): Token {
        const s = data.join()

        return new Token(TokenType.IDENTIFIER, s)
    }
}