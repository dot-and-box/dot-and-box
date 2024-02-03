import {Scanner} from "./scanner.ts"
import {DotsAndBoxesModel, Step} from "../shared/step.ts"
import {TokenType} from "./tokenType.ts"
import {Token} from "./token.ts"
import {Point} from "../shared/point.ts"
import {BoxControl} from "../controls/box/boxControl.ts"
import {DotControl} from "../controls/dot/dotControl.ts"
import {ActionBase} from "../shared/actionBase.ts"
import {Move} from "../actions/move.ts"
import {Swap} from "../actions/swap.ts"
import {Clone} from "../actions/clone.ts"
import {Sign} from "../shared/sign.ts"
import {COLORS, WHITE} from "../shared/constants.ts"
import {Assign} from "../actions/assign.ts"
import {Keywords} from "./keywords.ts"
import {CameraMove} from "../actions/cameraMove.ts";

export class Parser {
    scanner = new Scanner()
    model = Parser.newModel()
    position = 0
    tokens: Token[] = []

    static newModel(): DotsAndBoxesModel {
        return new DotsAndBoxesModel('', [], [])
    }

    public eof(): boolean {
        return this.tokens.length <= this.position
    }

    public advance(): Token {
        return this.tokens[this.position++]
    }

    public peek(): Token {
        return this.tokens[this.position]
    }

    public parse(source: string): DotsAndBoxesModel {
        this.model = Parser.newModel()
        this.tokens = this.scanner.scan(source)
        while (this.position < this.tokens.length) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.TITLE:
                    this.title()
                    break
                case TokenType.BOX:
                    this.box()
                    break
                case TokenType.DOT:
                    this.dot()
                    break
                case TokenType.STEPS:
                    this.steps()
                    break
            }
        }

        return this.model
    }

    box() {
        const box_tokens: Array<TokenType> = [TokenType.ID, TokenType.SIZE, TokenType.AT, TokenType.TEXT, TokenType.COLOR, TokenType.VISIBLE, TokenType.SELECTED]
        let size = new Point(100, 100)
        let at = new Point(0, 0)
        let text = ''
        let id = null
        let color = WHITE
        let visible = true
        let selected = false
        while (box_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.ID:
                    id = this.controlId()
                    break
                case TokenType.TEXT:
                    text = this.text()
                    break
                case TokenType.AT:
                    at = this.at()
                    break
                case TokenType.SIZE:
                    size = this.point()
                    break
                case TokenType.COLOR:
                    color = this.color()
                    break
                case TokenType.VISIBLE:
                    visible = this.visible()
                    break
                case TokenType.SELECTED:
                    selected = this.selected()
                    break
            }
        }
        if (id == null && text == '') {
            id = 'b' + this.model.controls.length
        }
        const box = new BoxControl(id != null ? id : text, at, size, color, text, visible, selected)
        this.model.controls.push(box)
        if (box.selected) {
            this.model.selectedControls.push(box)
        }

    }

    dot() {
        const dot_tokens: Array<TokenType> = [TokenType.ID, TokenType.SIZE, TokenType.AT, TokenType.TEXT, TokenType.COLOR, TokenType.VISIBLE, TokenType.SELECTED]
        let size = 20
        let at = new Point(0, 0)
        let text = ''
        let id = ''
        let color = COLORS[this.model.controls.length % COLORS.length]
        let visible = true
        let selected = false
        while (dot_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.ID:
                    id = this.controlId()
                    break
                case TokenType.TEXT:
                    text = this.text()
                    break
                case TokenType.COLOR:
                    color = this.color()
                    break
                case TokenType.AT:
                    at = this.at()
                    break
                case TokenType.SIZE:
                    size = this.number()
                    break
                case TokenType.VISIBLE:
                    console.log("vis")
                    visible = this.visible()
                    break
                case TokenType.SELECTED:
                    selected = this.selected()
                    break
            }
        }
        if (id == '' && text == '') {
            id = 'd' + this.model.controls.length
        }
        const dot = new DotControl(id != '' ? id : text, at, size, color, text != '' ? text : id, visible, selected)
        this.model.controls.push(dot)
        if (dot.selected) {
            this.model.selectedControls.push(dot)
        }
    }

    text(): string {
        if (this.peek().type == TokenType.STRING) {
            return this.advance().value
        }
        let result = ''
        while (this.peek().type == TokenType.IDENTIFIER) {
            const token = this.advance()
            result += ' ' + token.value.toString()
        }
        return result.trim()
    }

    color(): string {
        let result = ''

        if (this.peek().type == TokenType.IDENTIFIER) {
            let token = this.advance()
            result += token.value
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
        return result
    }

    at() {
        return this.point()
    }

    number() {
        let minus
        let token = this.peek()
        minus = token.type == TokenType.MINUS
        if (minus) {
            this.advance()
        }
        token = this.advance()
        if (token.type == TokenType.NUMBER) {
            let result = token.value.includes('.') ? parseFloat(token.value) : parseInt(token.value, 10)
            return minus ? -result : result
        } else {
            throw new Error(`Expected number at position: ${token.position} got token ${token.value} instead`)
        }
    }

    title() {
        this.model.title = this.text()
    }

    steps() {
        let step = new Step()
        let action = this.action()
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
            return null
        let controlId = this.controlId()

        let token = this.peek()
        switch (token.type) {
            case TokenType.ASSIGN:
                return this.assign(controlId)
            case TokenType.MOVE:
                return this.move(controlId)
            case TokenType.SWAP:
                return this.swap(controlId)
            case TokenType.CLONE:
                this.advance()
                token = this.peek()
                if (token.type == TokenType.IDENTIFIER) {
                    this.advance()
                    return new Clone(this.model, controlId, token.value)
                }
                break
        }
        return null
    }

    controlId(): string {
        let token = this.advance()
        if (token.type == TokenType.IDENTIFIER || token.type == TokenType.STRING || token.type == TokenType.NUMBER) {
            return token.value
        } else {
            throw new Error(`Expected control identifier at ${token.position} got ${token.value} instead`)
        }
    }

    move(leftControlId: string): ActionBase {
        this.advance()
        let point: Point = Point.zero()
        let rightId = ''
        let isPoint = this.pointInBracketsAhead()
        if (isPoint) {
            point = this.point()
        } else {
            let token = this.peek()
            rightId = token.value
            this.advance()
        }
        if (leftControlId == 'camera') {
            if (point.sign == Sign.NONE) {
                throw new Error(`Only relative move for camera is currently supported`)
            }
            return new CameraMove(this.model, point)
        }
        return new Move(this.model, leftControlId, point, rightId)
    }

    pointInBracketsAhead(): boolean {
        const token = this.peek();
        return token.type == TokenType.PLUS
            || token.type == TokenType.MINUS
            || token.type == TokenType.LEFT_BRACKET
    }

    assign(controlId: string): Assign {
        this.advance()
        let token = this.peek()
        let properties: Map<string, any> = new Map()

        while (!this.eof() && Keywords.ASSIGN_PROPERTIES.includes(token.type)) {
            let propertyName = ''
            if (token.type == TokenType.STRING) {
                propertyName = 'text'
            } else {
                this.advance()
                propertyName = token.type.toString()
            }
            const valueToken = this.peek()
            let value
            if (valueToken.type == TokenType.TRUE || valueToken.type == TokenType.FALSE) {
                value = this.boolean()
            } else {
                value = valueToken.value
            }
            properties.set(propertyName, value)
            this.advance()
            token = this.peek()
        }

        return new Assign(this.model, controlId, properties)
    }

    visible(): boolean {
        return this.boolean()
    }

    selected(): boolean {
        return this.boolean()
    }

    boolean(): boolean {
        const token = this.peek()
        switch (token.type) {
            case TokenType.TRUE:
                return true
            case TokenType.FALSE:
                return false
            default:
                throw new Error(`Expected boolean value: ${token.position} got token ${token.value} instead`)
        }
    }

    swap(leftControlId: string): Swap {
        this.advance()
        let token = this.peek()
        const rightControlId = token.value
        this.advance()
        return new Swap(this.model, leftControlId, rightControlId)
    }

    plus(): boolean {
        return this.match(TokenType.PLUS)
    }

    minus(): boolean {
        return this.match(TokenType.MINUS)
    }

    sign(): Sign {
        let sign: Sign = Sign.NONE
        if (this.plus()) {
            sign = Sign.PLUS
        }
        if (this.minus()) {
            sign = Sign.MINUS
        }
        return sign
    }

    point() {
        let sign = this.sign()
        const hasLeftBracket = this.match(TokenType.LEFT_BRACKET)
        let x = this.number()
        if (sign == Sign.MINUS && !hasLeftBracket) {
            x = -x
        }
        let token = this.advance()
        if (token.type != TokenType.COMMA) {
            throw new Error(`Expected comma at position: ${token.position} got token ${token} instead`)
        }
        let y = this.number()
        if (hasLeftBracket && !this.match(TokenType.RIGHT_BRACKET)) {
            throw new Error(`Expected right bracket at position: ${token.position} got token ${token} instead`)
        }
        return new Point(x, y, sign)
    }

    match(tokenType: TokenType) {
        if (this.eof()) return false
        if (this.peek().type != tokenType) return false

        this.position++
        return true
    }

    error(message: string) {
        throw new Error(message)
    }

}