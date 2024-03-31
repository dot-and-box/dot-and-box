import {Scanner} from "./scanner.ts"
import {Step} from "../shared/step.ts"
import {TokenType} from "./tokenType.ts"
import {Token} from "./token.ts"
import {Point} from "../shared/point.ts"
import {BoxControl} from "../controls/box/boxControl.ts"
import {DotControl} from "../controls/dot/dotControl.ts"
import {ActionBase} from "../shared/actionBase.ts"
import {Animate} from "../actions/animate.ts"
import {Swap} from "../actions/swap.ts"
import {Clone} from "../actions/clone.ts"
import {Sign} from "../shared/sign.ts"
import {BLACK, COLORS, DEFAULT_FONT_SIZE, POSITION, SIZE} from "../shared/constants.ts"
import {Assign} from "../actions/assign.ts"
import {Keywords} from "./keywords.ts"
import {CameraMove} from "../actions/cameraMove.ts";
import {LineControl} from "../controls/line/lineControl.ts";
import {Layout} from "../shared/layout.ts";
import {DotAndBoxModel} from "../shared/dotAndBoxModel.ts";
import {Unit} from "../shared/unit.ts";

export class Parser {
    scanner = new Scanner()
    model = Parser.newModel()
    position = 0
    tokens: Token[] = []
    cellSize = 50

    identifiesCounter = new Map<string, number>()

    static newModel(): DotAndBoxModel {
        return new DotAndBoxModel('', [], [])
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

    public parse(source: string): DotAndBoxModel {
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
                case TokenType.LINE:
                    this.line()
                    break
                case TokenType.DOTS:
                    this.dots()
                    break
                case TokenType.BOXES:
                    this.boxes()
                    break
                case TokenType.STEP:
                    this.step()
                    break
            }
        }
        return this.model
    }

    calculateLayoutPosition(layout: Layout, at: Point, index: number, spanInPixels: number): Point {
        let position = at.clone()
        switch (layout) {
            case Layout.COL:
                position.x += index * spanInPixels
                break
            case Layout.ROW:
                position.y += index * spanInPixels
                break
            case Layout.TREE:
                throw new Error(`Unsupported layout TREE at ${this.peek().position}`)
        }
        return position
    }

    boxes() {
        const boxes_tokens: Array<TokenType> = [TokenType.SIZE, TokenType.AT, TokenType.IDS, TokenType.LAYOUT, TokenType.SPAN, TokenType.COLORS]
        let size = new Point(this.cellSize, this.cellSize)
        let at = new Point(0, 0)
        let text = ''
        let id = ''
        let ids: string[] = []
        let colors: string[] = []
        let span = 0

        let layout = Layout.COL
        while (!this.eof() && boxes_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.ID:
                    id = this.propertyControlId()
                    break
                case TokenType.AT:
                    at = this.at()
                    break
                case TokenType.SIZE:
                    size = this.sizePoint()
                    break
                case TokenType.SPAN:
                    span = this.size()
                    break
                case TokenType.IDS:
                    ids = this.ids()
                    break
                case TokenType.COLORS:
                    colors = this.colors()
                    break
                case TokenType.LAYOUT:
                    layout = this.layout()
                    break
            }
        }
        if (ids.length == 0) {
            throw new Error(`ids attribute is mandatory for boxes at ${this.peek().position}`)
        }
        if (at.unit == Unit.CELL) {
            at.normalizeUnit(this.cellSize)
        }
        colors = colors.length > 0 ? colors : COLORS

        let spanInPixels = size.x + this.cellSize * span
        let i = 0;
        for (id of ids) {
            let position = this.calculateLayoutPosition(layout, at, i, spanInPixels)
            let color = colors[i % colors.length]
            const realId = this.getId(id != '' ? id : text)
            const box = new BoxControl(realId, position, size.clone(), DEFAULT_FONT_SIZE, color, text != '' ? text : id, true, false)
            this.model.controls.push(box)
            if (box.selected) {
                this.model.selectedControls.push(box)
            }
            i++
        }
    }

    getId(id: string): string {
        if (this.identifiesCounter.has(id.trim())) {
            let idCount = this.identifiesCounter.get(id)! + 1
            this.identifiesCounter.set(id, idCount)
            return idCount + '_' + id
        } else {
            this.identifiesCounter.set(id, 0)
            return id
        }
    }

    box() {
        const box_tokens: Array<TokenType> = [TokenType.ID, TokenType.SIZE, TokenType.AT, TokenType.TEXT, TokenType.COLOR, TokenType.VISIBLE, TokenType.SELECTED, TokenType.FONT_SIZE]
        let size = new Point(this.cellSize, this.cellSize)
        let at = new Point(0, 0)
        let text: string | null
        let id = null
        let color = COLORS[this.model.controls.length % COLORS.length]
        let visible = true
        let selected = false
        let fontSize = DEFAULT_FONT_SIZE
        text = this.textAfterColon();
        if (text == null)
            text = ''
        while (!this.eof() && box_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.ID:
                    id = this.propertyControlId()
                    break
                case TokenType.TEXT:
                    text = this.text()
                    break
                case TokenType.AT:
                    at = this.at()
                    break
                case TokenType.SIZE:
                    size = this.sizePoint()
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
                case TokenType.FONT_SIZE:
                    fontSize = this.fontSize()
                    break
            }
        }
        if (id == null) {
            id = 'b' + this.model.controls.length
        }
        if (at.unit == Unit.CELL) {
            at.normalizeUnit(this.cellSize)
        }
        const realId = this.getId(id != '' ? id : text)
        const box = new BoxControl(realId, at, size.clone(), fontSize, color, text, visible, selected)
        this.model.controls.push(box)
        if (box.selected) {
            this.model.selectedControls.push(box)
        }
    }

    textAfterColon(): string | null {
        let text = null
        if (this.match(TokenType.COLON)) {
            if (!this.eof() && this.peek().type === TokenType.STRING || this.peek().type === TokenType.IDENTIFIER) {
                text = this.peek().value;
                this.advance()
            }
        }
        return text
    }

    line() {
        const line_tokens: Array<TokenType> = [TokenType.ID, TokenType.END, TokenType.AT, TokenType.WIDTH, TokenType.COLOR, TokenType.VISIBLE, TokenType.SELECTED]
        let end = new Point(100, 100)
        let at = new Point(0, 0)
        let width = 1
        let id = null
        let color = BLACK
        let visible = true
        let selected = false
        while (!this.eof() && line_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.ID:
                    id = this.propertyControlId()
                    break
                case TokenType.AT:
                    at = this.at()
                    at.normalizeUnit(this.cellSize)
                    break
                case TokenType.END:
                    end = this.end()
                    end.normalizeUnit(this.cellSize)
                    break
                case TokenType.WIDTH:
                    width = this.width()
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
        if (id == null) {
            id = 'l' + this.model.controls.length
        }
        const realId = this.getId(id)
        const line = new LineControl(realId, at, end, width, color, visible, selected)
        this.model.controls.push(line)
        if (line.selected) {
            this.model.selectedControls.push(line)
        }
    }

    dots() {
        const dots_tokens: Array<TokenType> = [TokenType.SIZE, TokenType.AT, TokenType.IDS, TokenType.LAYOUT, TokenType.SPAN, TokenType.COLORS]
        let size = 20
        let at = new Point(0, 0)
        let text = ''
        let id = ''
        let ids: string[] = []
        let colors: string[] = []
        let span = 0
        let layout = Layout.COL

        while (!this.eof() && dots_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.ID:
                    id = this.propertyControlId()
                    break
                case TokenType.AT:
                    at = this.at()
                    break
                case TokenType.SIZE:
                    size = this.size()
                    break
                case TokenType.SPAN:
                    span = this.size()
                    break
                case TokenType.IDS:
                    ids = this.ids()
                    break
                case TokenType.COLORS:
                    colors = this.colors()
                    break
                case TokenType.LAYOUT:
                    layout = this.layout()
                    break
            }
        }
        if (ids.length == 0) {
            throw new Error(`ids attribute is mandatory for dots at ${this.peek().position}`)
        }

        colors = colors.length > 0 ? colors : COLORS
        let i = 0;
        let spanInPixels = this.cellSize + (span * this.cellSize)

        for (id of ids) {
            const realId = this.getId(id != '' ? id : text)
            if (at.unit == Unit.CELL && at.sign == Sign.NONE) {
                DotControl.normalizeDotPosition(at, this.cellSize);
            }
            let position = this.calculateLayoutPosition(layout, at, i, spanInPixels)
            let color = colors[i % colors.length]
            const dot = new DotControl(realId, position, size, color, text != '' ? text : id, true, false)
            this.model.controls.push(dot)
            if (dot.selected) {
                this.model.selectedControls.push(dot)
            }
            i++
        }
    }

    dot() {
        const dot_tokens: Array<TokenType> = [TokenType.ID, TokenType.SIZE, TokenType.AT, TokenType.TEXT, TokenType.COLOR, TokenType.VISIBLE, TokenType.SELECTED, TokenType.FONT_SIZE]
        let size = 20
        let at = new Point(0, 0)
        let text: string | null
        let id = ''
        let color = COLORS[this.model.controls.length % COLORS.length]
        let visible = true
        let selected = false
        let fontSize: number | null = null

        text = this.textAfterColon()

        while (!this.eof() && dot_tokens.includes(this.peek().type)) {
            const token = this.advance()
            switch (token.type) {
                case TokenType.ID:
                    id = this.propertyControlId()
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
                    size = this.size()
                    break
                case TokenType.VISIBLE:
                    visible = this.visible()
                    break
                case TokenType.SELECTED:
                    selected = this.selected()
                    break
                case TokenType.FONT_SIZE:
                    fontSize = this.fontSize()
                    break
            }
        }
        if (id === '' && text === '') {
            id = 'd' + this.model.controls.length
        }

        if (text == null) {
            text = id
        }

        const realId = this.getId(id != '' ? id : text)
        const dot = new DotControl(realId, at, size, color, text, visible, selected, fontSize)
        dot.normalizePositionUnit(dot.position, this.cellSize)
        this.model.controls.push(dot)
        if (dot.selected) {
            this.model.selectedControls.push(dot)
        }
    }

    text(): string {
        this.expectColon()
        if (this.peek().type == TokenType.STRING) {
            return this.advance().value
        }
        let result = ''
        while (!this.eof() && this.peek().type == TokenType.IDENTIFIER) {
            const token = this.advance()
            result += ' ' + token.value.toString()
        }
        return result.trim()
    }

    fontSize(): number {
        this.expectColon()
        return this.number()
    }

    color(): string {
        this.expectColon()
        return this.colorValue()
    }

    colors(): string[] {
        this.expectColon()
        let values: string[] = []
        while (!this.eof() && this.canBeColor(this.peek().type)) {
            values.push(this.colorValue())
        }
        return values
    }

    colorValue(): string {
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
        this.expectColon()
        return this.point()
    }

    end() {
        this.expectColon()
        return this.point()
    }

    size(): number {
        this.expectColon()
        return this.number()
    }

    layout(): Layout {
        this.expectColon()
        if (this.eof()) {
            throw new Error(`Expected proper layout got eof`)
        }
        let token = this.advance()
        const key: string = `${token.value.toString().toUpperCase()}`
        switch (key) {
            case Layout.COL:
                return Layout.COL
            case Layout.ROW:
                return Layout.ROW
            case Layout.TREE:
                return Layout.TREE
            default:
                throw new Error(`Expected proper layout at ${token.position} got ${token.value}  instead`)
        }

    }

    sizePoint(): Point {
        this.expectColon()
        const size = this.point()
        if (size.unit == Unit.CELL) {
            size.x = size.x * this.cellSize
            size.y = size.y * this.cellSize
            size.unit = Unit.PIXEL
        }
        return size
    }

    width() {
        this.expectColon()
        return this.number()
    }

    expectColon() {
        if (!this.match(TokenType.COLON)) {
            throw new Error(`Expected colon at ${this.position} got ${this.peek().value} instead`)
        }
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

    duration() {
        this.expectColon()
        let res = this.number()
        const identifier = this.peek()
        if (identifier.type == TokenType.IDENTIFIER && identifier.value == 's') {
            res *= 1000
            this.advance()
        } else if (identifier.type == TokenType.IDENTIFIER && identifier.value == 'ms') {
            this.advance()
        }
        return res
    }

    step() {
        this.expectColon()
        let step = new Step()
        if (this.peek().type === TokenType.STRING) {
            step.title = this.peek().value;
            this.advance()
        }
        if (this.match(TokenType.DURATION)) {
            step.duration = this.duration()
        }
        let action = this.action()
        let lasTokenWasComma = true
        while (action != null) {
            if (lasTokenWasComma) {
                step.addParallelAction(action)
            } else {
                step.addSequentialAction(action)
            }
            if (this.eof() || this.peek().type == TokenType.STEP) {
                if (step.sequences.length > 0) {
                    this.model.steps.push(step)
                }
                return
            }
            lasTokenWasComma = this.match(TokenType.COMMA)
            action = this.action()
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
            case TokenType.RESIZE:
                return this.resize(controlId)
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

    propertyControlId(): string {
        this.expectColon()
        return this.controlId()
    }

    controlId(): string {
        let token = this.advance()
        if (this.canBeId(token.type)) {
            let prefix = ''
            if (token.type == TokenType.NUMBER && !this.eof() && this.peek().value.startsWith('_')) {
                // quite a dirty hack - maybe we can find something more elegant
                prefix = token.value
                token = this.advance()
            }
            return prefix + token.value
        } else {
            throw new Error(`Expected control identifier at ${token.position} got ${token.value} instead`)
        }
    }

    canBeId(tokenType: TokenType) {
        return tokenType == TokenType.IDENTIFIER || tokenType == TokenType.STRING || tokenType == TokenType.NUMBER
    }

    canBeColor(tokenType: TokenType) {
        return tokenType == TokenType.IDENTIFIER || tokenType == TokenType.STRING
    }

    ids(): string[] {
        this.expectColon()
        let values: string[] = []
        while (!this.eof() && this.canBeId(this.peek().type)) {
            values.push(this.controlId())
        }
        return values
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
        return new Animate(this.model, POSITION, leftControlId, point, rightId)
    }

    resize(leftControlId: string): ActionBase {
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

        return new Animate(this.model, SIZE, leftControlId, point, rightId)
    }



    pointInBracketsAhead(): boolean {
        const token = this.peek();
        return token.type == TokenType.PLUS
            || token.type == TokenType.MINUS
            || token.type == TokenType.LEFT_BRACKET
            || token.type == TokenType.LEFT_SQUARE_BRACKET
    }

    assign(controlId: string): Assign {
        this.advance()
        let token = this.peek()
        let properties: Map<string, any> = new Map()

        while (!this.eof() && Keywords.ASSIGN_PROPERTIES.includes(token.type)) {
            let propertyName = ''
            let propertyTokenType = token.type
            if (propertyTokenType == TokenType.STRING) {
                propertyName = 'text'
            } else {
                this.advance()
                propertyName = token.type.toString()
            }

            const valueToken = this.peek()
            let value
            if (propertyTokenType == TokenType.COLOR) {
                value = this.color()
            } else if (propertyTokenType === TokenType.SELECTED || propertyTokenType === TokenType.VISIBLE) {
                this.expectColon()
                value = this.boolean()
            } else {
                value = valueToken.value
                this.advance()
            }
            properties.set(propertyName, value)

            token = this.peek()
        }

        return new Assign(this.model, controlId, properties)
    }

    visible(): boolean {
        this.expectColon()
        return this.boolean()
    }

    selected(): boolean {
        this.expectColon()
        return this.boolean()
    }

    boolean(): boolean {
        const token = this.advance()
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
        let unit = Unit.PIXEL
        let hasLeftBracket = this.match(TokenType.LEFT_BRACKET)
        let hasLeftSquareBracket = false
        if (!hasLeftBracket && this.match(TokenType.LEFT_SQUARE_BRACKET)) {
            hasLeftSquareBracket = true
            unit = Unit.CELL
        }
        const hasBracket = hasLeftBracket || hasLeftSquareBracket
        let x = this.number()
        if (!hasBracket && sign !== Sign.NONE) {
            x = -x
            sign = Sign.NONE
        }
        let token = this.advance()
        if (token.type != TokenType.COMMA) {
            throw new Error(`Expected comma at position: ${token.position} got token ${token} instead`)
        }
        let y = this.number()
        if (hasLeftBracket && !this.match(TokenType.RIGHT_BRACKET)) {
            throw new Error(`Expected right bracket at position: ${token.position} got token ${token} instead`)
        } else if (hasLeftSquareBracket && !this.match(TokenType.RIGHT_SQUARE_BRACKET)) {
            throw new Error(`Expected right square bracket at position: ${token.position} got token ${token} instead`)
        }
        return new Point(x, y, sign, unit)
    }

    match(tokenType: TokenType) {
        if (this.eof()) return false
        if (this.peek().type != tokenType) return false
        this.position++
        return true
    }

}