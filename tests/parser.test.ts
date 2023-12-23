import { expect, test } from 'vitest'
import {Parser} from "../src/parser/parser";

test('parser not null', () => {
    let p = new Parser()
    expect(p).not.eq(null)
})

test('parser simple', () => {
    let eg1= `title: bubble sort
                     dots: 
                       at: 120, 160
                       size: 45
                       data: 1, żółw23, 7, 4   
                     boxes: 
                       at: 120, 160
                     animate:
                       1: 4 <-> 7
                       2: 1 <-> 2
                       3: 1 -> something5
                    `
    let p = new Parser()
    p.parse(eg1)
    console.log(p.tokens)

    expect(p).not.eq(null)
})