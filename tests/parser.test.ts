import { expect, test } from 'vitest'
import {Parser} from "../src/parser/parser";

test('parser not null', () => {
    let p = new Parser()
    expect(p).not.eq(null)
})

test('parser simple', () => {
    let eg1 = "title: bubble sort\n" +
        "dots (at: 120, 160): 1, 2, 7, 4\n" +
        "component (size: 230, 450): trash\n" +
        "locations: A(373,738)\n" +
        "animate: 4 <-> 7,  2 -> trash, 7 -> A"
    let p = new Parser()
    p.parse(eg1)
    console.log(p.tokens)

    expect(p).not.eq(null)
})