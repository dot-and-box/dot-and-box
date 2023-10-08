import { expect, test } from 'vitest'
import {Parser} from "../src/parser/parser";

test('parser not null', () => {
    let p = new Parser()
    expect(p).not.eq(null)
})

test('parser simple', () => {
    let eg1= "title: bubble sort\n" +
                    "dots: \n" +
                    "    at: 120, 160\n" +
                    "    size: 45\n" +
                    "    data: 1, 2, 7, 4   \n" +
                    "boxes: \n" +
                    "    at: 120, 160  \n" +
                    "animate: \n" +
                    "    1: 4 <-> 7\n" +
                    "    2: 1 <-> 2"


    let p = new Parser()
    p.parse(eg1)
    console.log(p.tokens)

    expect(p).not.eq(null)
})