import { Sign } from "./sign.ts"
import { Unit } from "./unit.ts";

export class Point {
  public x: number
  public y: number
  public sign: Sign
  public unit: Unit

  constructor(x: number, y: number, sign: Sign = Sign.NONE, unit = Unit.PIXEL) {
    this.x = x
    this.y = y
    this.sign = sign
    this.unit = unit
  }

  clone(): Point {
    return new Point(this.x, this.y, this.sign, this.unit)
  }

  plus(point: Point): Point {
    return new Point(this.x + point.x, this.y + point.y, this.sign, this.unit)
  }

  minus(point: Point): Point {
    return new Point(this.x - point.x, this.y - point.y, Sign.NONE)
  }

  normalizeSign(): Point {
    const newX: number = this.sign == Sign.MINUS ? -this.x : this.x
    const newY: number = this.sign == Sign.MINUS ? -this.y : this.y
    return new Point(newX, newY, Sign.NONE, this.unit)
  }

  normalizeUnit(cellSize: number) {
    if (this.unit == Unit.CELL) {
      this.x = this.x * cellSize
      this.y = this.y * cellSize
      this.unit = Unit.PIXEL
    }
  }

  static zero = (): Point => new Point(0, 0)

}
