import {Point} from "./point.ts";
import {Control, Dot, Change} from "./dot.ts";
import {Tool} from "./tool.ts";
import {Component} from "./component.ts";
import {ChangeType, Direction, DotsModel, MoveChange, Step} from "./step.ts";
import {COLORS, MAX_ZOOM, MIN_ZOOM, SCROLL_SENSITIVITY, SIZES} from "./constants.ts";

export class Dots {
    private canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D
    public zoom: number = 1
    public isDragging = false
    private initialPinchDistance: number = 0
    private lastZoom = this.zoom
    public controls: Control[] = []
    private origin: Point = new Point(window.innerWidth / 2, window.innerHeight / 2)
    public offset: Point = new Point(window.innerWidth / 2, window.innerHeight / 2)

    public readonly EMPTY_TOOL: string = "empty-tool"
    public readonly DOTS_TOOL: string = "dots-tool"
    public readonly COMPONENT_TOOL: string = "component-tool"
    public readonly PAN_ZOOM_TOOL: string = "pan-zoom-tool"
    private tool: Tool = new PanZoomTool(this)

    private tools: Map<string, Tool> = new Map([
        [this.EMPTY_TOOL, new EmptyTool()],
        [this.DOTS_TOOL, new DotsTool(this.controls)],
        [this.COMPONENT_TOOL, new ComponentTool(this)],
        [this.PAN_ZOOM_TOOL, new PanZoomTool(this)]
    ])

    private step: number = 0
    private steps: Step[] = []

    public parse(model: DotsModel) {
        this.step = 0
        for (const control of model.controls) {
            this.tools.get(this.DOTS_TOOL)!.click(control.position)
        }
        this.steps = model.steps;
        if (this.steps.length > 0) {
            this.initStep()
        }
    }

    private changes: Change[] = []
    public pause = false;

    constructor(canvasId: string) {
        this.selectTool(this.PAN_ZOOM_TOOL)
        this.canvas = document.getElementById(canvasId)! as
            HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d')! as
            CanvasRenderingContext2D
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.canvas.addEventListener('mousedown', (e) =>
            this.onPointerDown(e))
        this.canvas.addEventListener('touchstart', (e) =>
            this.handleTouch(e, this.onPointerDown))
        this.canvas.addEventListener('mouseup', (_) =>
            this.onPointerUp())
        this.canvas.addEventListener('touchend', (e) =>
            this.handleTouch(e, this.onPointerUp))
        this.canvas.addEventListener('mousemove', (e) =>
            this.onPointerMove(e))
        this.canvas.addEventListener('touchmove', (e) =>
            this.handleTouch(e, this.onPointerMove))
        this.canvas.addEventListener('wheel', (e) =>
            this.adjustZoom(e.deltaY * SCROLL_SENSITIVITY, 1))
    }

    selectTool(toolName: string) {
        if (this.tools.has(toolName)) {
            this.tool = this.tools.get(toolName)!
        }
    }


    private initStep(): Step {
        const currentStep = this.steps[this.step]
        this.changes = []
        for (const change of currentStep.changes) {
            if (change.type == ChangeType.MOVE) {
                this.handleMoveChange(change as MoveChange)
            }
        }
        return currentStep
    }

    forward() {
        let currentStep = this.steps[this.step]
        if (currentStep.finished) {
            if (this.step < this.steps.length - 1) {
                this.step++
                currentStep = this.initStep()
            }
        }
        if (currentStep.direction != Direction.FORWARD) {
            currentStep.direction = Direction.FORWARD
            this.swapMovePoints();
        }
    }

    private swapMovePoints() {
        for (let i = this.changes.length - 1; i >= 0; i--) {
            const move = this.changes[i]
            const p = new Point(move.end.x, move.end.y)
            move.end = move.start
            move.start = p;
            move.finished = false
        }
    }

    back() {
        let currentStep = this.steps[this.step]

        if (currentStep.finished && currentStep.direction == Direction.FORWARD) {
            currentStep.direction = Direction.BACKWARD
            currentStep.finished = false
            this.swapMovePoints()
        } else if (currentStep.finished && currentStep.direction == Direction.BACKWARD) {
            if (this.step > 0) {
                this.step--
                this.initStep()
                this.swapMovePoints()
            }
        }
    }

    handleMoveChange(change: MoveChange) {
        const foundControl = this.controls[change.controlIndex]
        if (foundControl) {
            this.changes.push(new Change(foundControl.position, change.targetPosition, foundControl))
        }
    }

    readonly animationStep: number = 5;


    public draw() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        this.ctx.translate(this.origin.x, this.origin.y)
        this.ctx.scale(this.zoom, this.zoom)
        this.ctx.translate(-this.origin.x + this.offset.x, -this.origin.y + this.offset.y)

        this.ctx.fillStyle = COLORS[this.controls.length % COLORS.length]
        this.drawText("Dots are ruling the world bro!", -255, -100, 42,
            "courier")
        if (!this.pause && this.changes.length > 0) {
            this.handleMoves();
        }
        for (const control of this.controls) {
            control.draw(this.ctx)
        }
        requestAnimationFrame(() => this.draw())
    }


    private handleMoves() {

        let allMovesFinished = true;
        for (const move of this.changes) {
            if (move.finished)
                continue

            allMovesFinished = false
            let xFinished = false
            let yFinished = false
            if (move.control.position.x < move.end.x) {
                const dx = move.end.x - move.control.position.x;
                if (dx <= this.animationStep) {
                    move.control.position.x += dx
                    xFinished = true;
                } else {
                    move.control.position.x += this.animationStep
                }
            } else if (move.control.position.x > move.end.x) {
                const dx = move.control.position.x - move.end.x;
                if (dx <= this.animationStep) {
                    move.control.position.x -= dx
                    xFinished = true;
                } else {
                    move.control.position.x -= this.animationStep
                }
            } else {
                xFinished = true
            }

            if (move.control.position.y < move.end.y) {
                const dy = move.end.y - move.control.position.y;
                if (dy <= this.animationStep) {
                    move.control.position.y += dy
                    yFinished = true;
                } else {
                    move.control.position.y += this.animationStep
                }
            } else if (move.control.position.y > move.end.y) {
                const dy = move.control.position.y - move.end.y;
                if (dy <= this.animationStep) {
                    move.control.position.y -= dy
                    yFinished = true;
                } else {
                    move.control.position.y -= this.animationStep
                }
            } else {
                yFinished = true
            }
            if (xFinished && yFinished)
                move.finished = true

        }
        const currentStep = this.steps[this.step]
        if (allMovesFinished && currentStep.direction == Direction.FORWARD) {
            currentStep.finished = true
        }

    }

    private getEventLocation(e: any): Point | null {
        if (e.touches && e.touches.length == 1) {
            return new Point(e.touches[0].clientX, e.touches[0].clientY)
        } else if (e.clientX && e.clientY) {
            return new Point(e.clientX, e.clientY)
        }
        return null
    }

    drawText(text: string, x: number, y: number, size: number, font:
        string) {
        this.ctx.font = `${size}px ${font}`
        this.ctx.fillText(text, x, y)
    }

    private onPointerDown(e: MouseEvent) {
        this.isDragging = true
        let clientPoint = this.getEventLocation(e)
        if (clientPoint == null)
            return

        const point = new Point(
            clientPoint.x / this.zoom - this.offset.x + this.origin.x - this.origin.x / this.zoom,
            clientPoint.y / this.zoom - this.offset.y + this.origin.y - this.origin.y / this.zoom
        )
        this.tool.click(point)
    }

    private onPointerUp() {
        this.isDragging = false
        this.initialPinchDistance = 0
        this.lastZoom = this.zoom
    }

    private onPointerMove(e: any) {
        if (this.isDragging) {
            let clientPoint = this.getEventLocation(e)!
            let movePoint = new Point(
                clientPoint.x / this.zoom + this.origin.x - this.origin.x / this.zoom,
                clientPoint.y / this.zoom + this.origin.y - this.origin.y / this.zoom
            )
            this.tool.move(movePoint)
        }
    }

    private handleTouch(e: any, singleTouchHandler: any) {
        if (e.touches.length == 1) {
            singleTouchHandler(e)
        } else if (e.type == "touchmove" && e.touches.length == 2) {
            this.isDragging = false
            this.handlePinch(e)
        }
    }

    private handlePinch(e: any) {
        e.preventDefault()
        let touch1 = {x: e.touches[0].clientX, y: e.touches[0].clientY}
        let touch2 = {x: e.touches[1].clientX, y: e.touches[1].clientY}
        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y -
            touch2.y) ** 2
        if (this.initialPinchDistance == null) {
            this.initialPinchDistance = currentDistance
        } else {
            this.adjustZoom(null, currentDistance /
                this.initialPinchDistance)
        }
    }

    private adjustZoom(zoomAmount: any, zoomFactor: any) {
        if (!this.isDragging) {
            if (zoomAmount) {
                this.zoom -= zoomAmount
            } else if (zoomFactor) {
                this.zoom = zoomFactor * this.lastZoom
            }
            this.zoom = Math.min(this.zoom, MAX_ZOOM)
            this.zoom = Math.max(this.zoom, MIN_ZOOM)
        }
    }

    togglePause() {
        this.pause = !this.pause
    }
}


class EmptyTool extends Tool {
    override click(point: Point): void {
        console.log(point)
    }

    override move(point: Point): void {
        console.log(point)
    }

    override up(point: Point): void {
        console.log(point)
    }
}

class DotsTool extends Tool {

    controls: Control[]

    constructor(controls: Control[]) {
        super()
        this.controls = controls
    }

    override click(point: Point): void {
        this.controls.push(new Dot(
            point,
            COLORS[this.controls.length % COLORS.length],
            SIZES[this.controls.length % SIZES.length],
            this.controls.length.toString(),
        ))
    }

}

class PanZoomTool extends Tool {

    dots: Dots
    dragStart: Point = Point.zero()

    constructor(dots: Dots) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dragStart = point
    }

    override move(movePoint: Point) {
        this.dots.offset = new Point(
            movePoint.x - this.dragStart.x,
            movePoint.y - this.dragStart.y
        )
    }

}

class ComponentTool extends Tool {

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

