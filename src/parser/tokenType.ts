export enum TokenType {
    MINUS = "-",
    PLUS = "+",
    COMMA = ",",
    COLON = ":",
    EQUALS = "=",
    LEFT_BRACKET = "(",
    RIGHT_BRACKET = ")",
    LESS_THAN = "<",
    ASTERIX = "*",
    GREATER_THAN = ">",
    // actions
    ASSIGN = "<-",
    CLONE = "*->",
    SWAP = "<->",
    MOVE = "->",
    // literals
    IDENTIFIER = "IDENTIFIER",
    NUMBER = "NUMBER",
    STRING = "STRING",
    // keywords
    ID = "id",
    TITLE = "title",
    TEXT = "text",
    DOT = "dot",
    DOTS = "dots",
    AT = "at",
    SIZE = "size",
    COLOR = "color",
    DATA = "data",
    BOX = "box",
    STEPS = "steps",
    SELECTED  = "selected"
}