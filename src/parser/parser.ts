import {ParseResult} from "./parseResult.ts";
import {TokenType} from "./tokenType.ts";
import {Token} from "./token.ts";

export class Parser {
    static readonly SWAP: string = "SWAP"
    static readonly SWP: string = "SWAP"
    static readonly keywords: string[] = [Parser.SWAP,]
    public parse(data: string): ParseResult {
        const result = new ParseResult()
        const lines = data.split("\n")
        const tokens = []
        let buffer = []
        for(let l = 0; l < lines.length;l++){
            const line = lines[l]
            let n = 0;
            while(n < line.length){
                const c = line.charAt(n)
                switch(c){
                    case ":":
                        tokens.push(new Token(TokenType.COLON))
                        break;
                    case ",":
                        tokens.push(new Token(TokenType.COMMA))
                        break;
                    default:
                       buffer.push(c)
                }
                n++
            }
            if(buffer.length > 0){
                tokens.push(this.identifier(buffer))
            }

        }
        return result
    }

    private identifier(data: string[]): Token{
        const s = data.join()

        return new Token(TokenType.IDENTIFIER,s)
    }
}