import { Point } from "../../shared/point.ts"
import { Control } from "../control.ts"

export class DummyControl extends Control {
  position: Point
  selected: boolean = false
  visible: boolean = true


  public constructor() {
    super()
    this.id = 'dummy'
    this.position = Point.zero()
    this.size = Point.zero()
  }

  clone(): Control {
    return new DummyControl()
  }

  draw(_: CanvasRenderingContext2D): void {
  }

  // @ts-ignore
  hitTest(point: Point): boolean {
    return false
  }

  static getInstance() {
    return new DummyControl()
  }

  getPointPropertyValue(_: string): Point {
    return Point.zero()
  }

  animateEndByPropertyAndTarget(_: string, __: Control): Point {
    return Point.zero()
  }

}
