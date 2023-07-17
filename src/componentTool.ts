import {Tool} from "./tool.ts";
import {Point} from "./point.ts";
import {Component} from "./component.ts";
import {Dots} from "./dots.ts";

export class ComponentTool extends Tool {

    dots: Dots
    dragStart: Point = Point.zero()

    constructor(dots: Dots) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dragStart = point

        this.dots.controls.push(new Component(
            point,
            "rgba(37,33,133,0.68)",
            new Point(50, 50),
            this.dots.controls.length.toString(),
        ))

    }


}