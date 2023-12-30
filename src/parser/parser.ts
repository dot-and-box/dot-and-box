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

export class Parser {
    scanner = new Scanner()
    model = new DotsAndBoxesModel('', [], [])
    position = 0;
    tokens: Token[];

    public eof(): boolean {
        return this.tokens.length <= this.position;
    }

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
        const box_tokens = [TokenType.SIZE, TokenType.AT, TokenType.NAME, TokenType.COLOR]
        let size = new Point(100, 100)
        let at = new Point(0, 0)
        let name = 'box'
        let color = 'white'
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
                case TokenType.COLOR:
                    color = this.color()
                    break;
            }
        }
        this.model.controls.push(new BoxControl(name, at, color, size, name))
    }

    dot() {
        const dot_tokens = [TokenType.SIZE, TokenType.AT, TokenType.NAME, TokenType.COLOR]
        let size = new Point(20, 20)
        let at = new Point(0, 0)
        let name = 'dot' + this.model.controls.length
        let color = 'red'
        while (dot_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.NAME:
                    name = this.name()
                    break;
                case TokenType.COLOR:
                    color = this.color()
                    break;
                case TokenType.AT:
                    at = this.at()
                    break;
                case TokenType.SIZE:
                    size = this.size()
                    break;
            }
        }
        this.model.controls.push(new DotControl(name, at, color, size.x, name))
    }

    name(): string {

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
        while (this.peek().type == TokenType.IDENTIFIER) {
            const token = this.advance();
            result += ' ' + token.value;
        }
        return result
    }

    size() {
        let x = this.number()
        // noinspection JSSuspiciousNameCombination
        let y = x;

        let token = this.peek()
        if (token.type == TokenType.COMMA) {
            this.advance()
            y = this.number()
        }
        return new Point(x, y)
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
            let result = parseInt(token.value)
            return minus ? -result : result;
        } else {
            throw new Error(`Expected number at position: ${token.position} got token ${token.value} instead`)
        }
    }

    title() {
        this.model.title = this.name()
    }

    steps() {
        let action = this.action();
        while (action != null) {
            const step = new Step()
            step.actions.push(action)
            this.model.steps.push(step)

            action = this.action()
        }

    }

    action(): ActionBase | null {
        if (this.eof())
            return null;

        let token = this.advance()
        if (token.type == TokenType.IDENTIFIER || token.type == TokenType.STRING) {
            const leftControlId = token.value;
            const control = this.findControl(leftControlId)

            token = this.peek()
            switch (token.type) {
                case TokenType.MOVE_TO:
                    this.advance();
                    const point = this.point();
                    if (control) {
                        return new Move(point, control);
                    }
                    break;
                case TokenType.SWAP:
                    this.advance()
                    token = this.peek()
                    const rightControl = this.findControl(token.value)
                    if (control && rightControl) {
                        this.advance()
                        return new Swap(control, rightControl);
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
        let x = this.number()
        let token = this.advance()
        if (token.type != TokenType.COMMA) {
            throw new Error(`Expected comma at position: ${token.position} got token ${token} instead`)
        }
        let y = this.number()
        return new Point(x, y)
    }

    error(message: String) {
        throw new Error(message)
    }

}