import {Scanner} from "./scanner.ts";
import {DotsAndBoxesModel} from "../shared/step.ts";
import {TokenType} from "./tokenType.ts";
import {Token} from "./token.ts";
import {TextControl} from "../text/textControl.ts";
import {Point} from "../shared/point.ts";
import {BoxControl} from "../box/boxControl.ts";

export class Parser {
    scanner = new Scanner()
    model = new DotsAndBoxesModel('', [], [])
    position = 0;
    tokens: Token[];

    public advance(): Token {
        return this.tokens[this.position++];
    }

    public peek(): Token {
        return this.tokens[this.position];
    }

    public parse(source): DotsAndBoxesModel {
        this.tokens = this.scanner.scan(source)
        this.model.title = ''
        while (this.position < this.tokens.length) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.TITLE:
                    this.title()
                    break;
                case TokenType.BOX:
                    this.box()
                    break;
            }
        }

        return this.model;
    }

    box() {
        const box_tokens = [TokenType.SIZE, TokenType.AT, TokenType.NAME]
        let size = new Point(100, 100)
        let at = new Point(0, 0)
        let name = 'box'
        let color = 'black'
        while (box_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.NAME:
                    name = this.name()
                    break;
                case TokenType.AT:
                    at = this.at()
                    break;
                case TokenType.SIZE:
                    size = this.size()
                    break;
            }
        }
        this.model.controls.push(new BoxControl(at, color, size, name))
    }

    name(): string {
        let result = ''
        while (this.peek().type == TokenType.IDENTIFIER) {
            const token = this.advance();
            result += ' ' + token.value;
        }
        return result
    }

    size() {
        return new Point(50, 50)
    }

    at() {
        let x = this.number()
        let token = this.advance()
        if (token.type != TokenType.COMMA) {
            throw new Error(`Expected comma at position: ${token.position} got token ${token} instead`)
        }
        let y = this.number()
        return new Point(x, y)
    }

    number() {
        let minus = false
        let token = this.peek()
        minus = token.type == TokenType.MINUS;
        if (minus) {
            this.advance()
        }
        token = this.advance()

        if (token.type == TokenType.NUMBER) {
            let result = parseInt(token.value)
            return minus ? -result : result;
        } else {
            throw new Error(`Expected number at position: ${token.position} got token ${token.value} instead`)
        }
    }

    title() {
        this.model.title = this.name()
        if (this.model.title) {
            this.model.controls.push(new TextControl(Point.zero(), 'red', new Point(200, 10), this.model.title))
        }
    }

}