import {Scanner} from "./scanner.ts";
import {DotsAndBoxesModel} from "../shared/step.ts";
import {TokenType} from "./tokenType.ts";
import {Token} from "./token.ts";
import {TextControl} from "../text/textControl.ts";
import {Point} from "../shared/point.ts";

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
            }
        }

        return this.model;
    }

    title() {
        const token = this.peek();
        if (token.type == TokenType.IDENTIFIER) {
            this.model.title = token.value;
            this.model.controls.push(new TextControl(Point.zero(), 'red', new Point(10, 10), this.model.title))
        }

    }

}