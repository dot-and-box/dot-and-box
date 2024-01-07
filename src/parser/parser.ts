import {Scanner} from "./scanner.ts";
import {DotsAndBoxesModel, Step} from "../shared/step.ts";
import {TokenType} from "./tokenType.ts";
import {Token} from "./token.ts";
import {Point} from "../shared/point.ts";
import {BoxControl} from "../box/boxControl.ts";
import {Control, DotControl} from "../dot/dotControl.ts";
import {ActionBase} from "../shared/actionBase.ts";
import {Move} from "../shared/move.ts";
import {Swap} from "../shared/swap.ts";
import {Clone} from "../shared/clone.ts";

export class Parser {
    scanner = new Scanner()
    model = new DotsAndBoxesModel('', [], [])
    position = 0;
    tokens: Token[] = []

    public eof(): boolean {
        return this.tokens.length <= this.position;
    }

    public advance(): Token {
        return this.tokens[this.position++];
    }

    public peek(): Token {
        return this.tokens[this.position];
    }

    public parse(source: string): DotsAndBoxesModel {
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
                case TokenType.DOT:
                    this.dot()
                    break;
                case TokenType.STEPS:
                    this.steps()
                    break;
            }
        }

        return this.model;
    }

    box() {
        const box_tokens = [TokenType.ID, TokenType.SIZE, TokenType.AT, TokenType.TEXT, TokenType.COLOR]
        let size = new Point(100, 100)
        let at = new Point(0, 0)
        let text = 'box' + this.model.controls.length
        let id = null
        let color = 'white'
        while (box_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.ID:
                    id = this.text()
                    break;
                case TokenType.TEXT:
                    text = this.text()
                    break;
                case TokenType.AT:
                    at = this.at()
                    break;
                case TokenType.SIZE:
                    size = this.point()
                    break;
                case TokenType.COLOR:
                    color = this.color()
                    break;
            }
        }
        this.model.controls.push(new BoxControl(id != null ? id : text, at, size, color, text))
    }

    dot() {
        const dot_tokens = [TokenType.ID, TokenType.SIZE, TokenType.AT, TokenType.TEXT, TokenType.COLOR]
        let size = 20
        let at = new Point(0, 0)
        let text = 'dot' + this.model.controls.length
        let id = null
        let color = 'red'
        while (dot_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.ID:
                    id = this.text()
                    break;
                case TokenType.TEXT:
                    text = this.text()
                    break;
                case TokenType.COLOR:
                    color = this.color()
                    break;
                case TokenType.AT:
                    at = this.at()
                    break;
                case TokenType.SIZE:
                    size = this.number()
                    break;
            }
        }
        this.model.controls.push(new DotControl(id != null ? id : text, at, size, color, text))
    }

    text(): string {

        if (this.peek().type == TokenType.STRING) {
            return this.advance().value;
        }

        let result = ''
        while (this.peek().type == TokenType.IDENTIFIER) {
            const token = this.advance();
            result += ' ' + token.value.toString();
        }
        return result.trim()
    }

    color(): string {
        let result = ''

        if (this.peek().type == TokenType.IDENTIFIER) {
            let token = this.advance();
            result += token.value;
            if (this.match(TokenType.LEFT_BRACKET)) {
                result += '('
                result += this.number().toString()
                while (this.match(TokenType.COMMA)) {
                    result += ','
                    result += this.number().toString()
                }
                if (this.match(TokenType.RIGHT_BRACKET)) {
                    result += ')'
                } else {
                    throw new Error(`Expected closing bracket at ${this.peek().position} got token ${this.peek().value} instead`)
                }
            }
        }
        return result;
    }

    at() {
        return this.point()
    }

    number() {
        let minus
        let token = this.peek()
        minus = token.type == TokenType.MINUS;
        if (minus) {
            this.advance()
        }
        token = this.advance()

        if (token.type == TokenType.NUMBER) {
            let result = token.value.includes('.') ? parseFloat(token.value) : parseInt(token.value, 10)
            return minus ? -result : result;
        } else {
            throw new Error(`Expected number at position: ${token.position} got token ${token.value} instead`)
        }
    }

    title() {
        this.model.title = this.text()
    }

    steps() {
        let step = new Step()

        let action = this.action();
        while (action != null) {
            step.actions.push(action)
            if (!this.match(TokenType.COMMA)) {
                this.model.steps.push(step)
                step = new Step()
            }
            action = this.action()
        }
        if (step.actions.length > 0) {
            this.model.steps.push(step)
        }
    }

    action(): ActionBase | null {
        if (this.eof())
            return null;

        let token = this.advance()
        if (token.type == TokenType.IDENTIFIER || token.type == TokenType.STRING) {
            const leftControlId = token.value;

            token = this.peek()
            switch (token.type) {
                case TokenType.MOVE_TO:
                    this.advance();
                    const point = this.point();
                    return new Move(leftControlId, point);
                case TokenType.SWAP:
                    this.advance()
                    token = this.peek()
                    const rightControlId = token.value
                    this.advance()
                    return new Swap(leftControlId, rightControlId);
                case TokenType.CLONE:
                    this.advance()
                    token = this.peek()
                    if (token.type == TokenType.IDENTIFIER) {
                        this.advance()
                        return new Clone(leftControlId, token.value);
                    }
                    break;

            }
        } else {
            this.error('Expected identifier while handling step')
        }
        return null;
    }

    findControl(identifier: string): Control | undefined {
        return this.model.controls.find(c => c.id == identifier)
    }

    point() {
        const hasLeftBracket = this.match(TokenType.LEFT_BRACKET);
        let x = this.number()
        let token = this.advance()
        if (token.type != TokenType.COMMA) {
            throw new Error(`Expected comma at position: ${token.position} got token ${token} instead`)
        }
        let y = this.number()
        if (hasLeftBracket && !this.match(TokenType.RIGHT_BRACKET)) {
            throw new Error(`Expected right bracket at position: ${token.position} got token ${token} instead`)
        }
        return new Point(x, y)
    }

    match(tokenType: TokenType) {
        if (this.eof()) return false;
        if (this.peek().type != tokenType) return false;

        this.position++;
        return true;
    }

    error(message: string) {
        throw new Error(message)
    }

}