import {Point} from "./point.ts";
import {Control} from "./dot.ts";
import {Tool} from "./tool.ts";
import {Change, ChangeType, DotsModel, Move, MoveChange, StepImpl, StepState} from "./step.ts";
import {COLORS, MAX_ZOOM, MIN_ZOOM, SCROLL_SENSITIVITY} from "./constants.ts";
import {DotsTool} from "./dotsTool.ts";
import {EmptyTool} from "./emptyTool.ts";
import {PanZoomTool} from "./panZoomTool.ts";
import {ComponentTool} from "./componentTool.ts";

export class Dots {
    private readonly canvas: HTMLCanvasElement
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


    private steps: StepImpl[] = []
    private currentStepIndex = 0;
    private currentStep = new StepImpl()

    public parse(model: DotsModel) {
        for (const control of model.controls) {
            this.tools.get(this.DOTS_TOOL)!.click(control.position)
        }
        this.steps = []
        model.steps.forEach(s => {
            const step = new StepImpl()
            this.initStep(step, s.changes)
            this.steps.push(step)
        })
        this.currentStep = this.steps[this.currentStepIndex]
    }

    public pause = false;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId)! as HTMLCanvasElement
        this.ctx = canvas.getContext('2d')! as CanvasRenderingContext2D
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        this.canvas = canvas;
        this.attachCanvasEventHandlers()
    }

    private attachCanvasEventHandlers() {
        this.addCanvasEvent('mousedown', (e: any) => this.onPointerDown(e))
        this.addCanvasEvent('mousedown', (e: any) => this.onPointerDown(e))
        this.addCanvasEvent('touchstart', (e: any) => this.handleTouch(e, this.onPointerDown))
        this.addCanvasEvent('mouseup', (_: any) => this.onPointerUp())
        this.addCanvasEvent('touchend', (e: any) => this.handleTouch(e, this.onPointerUp))
        this.addCanvasEvent('mousemove', (e: any) => this.onPointerMove(e))
        this.addCanvasEvent('touchmove', (e: any) => this.handleTouch(e, this.onPointerMove))
        this.addCanvasEvent('wheel',
            (e: any) => this.adjustZoom(e.deltaY * SCROLL_SENSITIVITY, 1))
    }

    private addCanvasEvent(eventName: string, lambda: any) {
        this.canvas.addEventListener(eventName, lambda)
    }

    selectTool(toolName: string) {
        if (this.tools.has(toolName)) {
            this.tool = this.tools.get(toolName)!
        }
    }

    private initStep(step: StepImpl, changes: Change[]) {
        for (const change of changes) {
            if (change.type == ChangeType.MOVE) {
                const moveChange = change as MoveChange
                const foundControl = this.controls[moveChange.controlIndex]
                if (foundControl) {
                    step.changes.push(new Move(moveChange.targetPosition, foundControl))
                }
            }
        }
    }

    forward() {
        this.currentStep.reset()

        if (this.currentStep.state == StepState.END) {
            if (this.currentStepIndex < this.steps.length - 1) {
                this.currentStepIndex++
                this.currentStep = this.steps[this.currentStepIndex]
                this.currentStep.forward()
            }
        }
        this.currentStep.animationStep = 0.01
    }


    back() {
        this.currentStep.reset()

        if (this.currentStep.state == StepState.START) {
            if (this.currentStepIndex > 0) {
                this.currentStepIndex--
                this.currentStep = this.steps[this.currentStepIndex]
            }
        }
        this.currentStep.animationStep = -0.01
    }

    public draw() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        this.drawText("rate", window.innerWidth - 50, 20, 22, "courier")

        this.ctx.translate(this.origin.x, this.origin.y)
        this.ctx.scale(this.zoom, this.zoom)
        this.ctx.translate(-this.origin.x + this.offset.x, -this.origin.y + this.offset.y)

        this.ctx.fillStyle = COLORS[this.controls.length % COLORS.length]
        this.drawText("Dots are ruling the world bro!", -255, -100, 42,
            "courier")
        if (!this.pause && this.currentStep && this.currentStep.changes.length > 0) {
            this.updateChanges();
        }
        for (const control of this.controls) {
            control.draw(this.ctx)
        }
        requestAnimationFrame(() => this.draw())
    }


    private updateChanges() {
        for (const change of this.currentStep.changes) {
            if (change.finished)
                continue
            if (change.type == ChangeType.MOVE) {
                this.handleMove(change as Move)
            }
        }
    }

    private handleMove(move: Move) {
        if (this.currentStep.animationStep == 0)
            return
        let newProgress = move.progress + this.currentStep.animationStep
        if (newProgress <= 0 || newProgress >= 1) {
            newProgress = newProgress <= 0 ? 0 : 1
        }
        move.progress = newProgress

        const dx = move.end.x - move.start.x
        const dy = move.end.y - move.start.y

        if (move.progress == 0) {
            move.control.position.x = move.start.x
            move.control.position.y = move.start.y
        } else if (move.progress == 1) {
            move.control.position.x = move.start.x + dx
            move.control.position.y = move.start.y + dy
        } else {
            move.control.position.x = move.start.x + dx * move.progress
            move.control.position.y = move.start.y + dy * move.progress
        }
        if (newProgress <= 0 || newProgress >= 1) {
            move.finished = true
            this.currentStep.notifyFinished()
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
        let touch1 = {x: e.touches[0].clientX as number, y: e.touches[0].clientY as number}
        let touch2 = {x: e.touches[1].clientX as number, y: e.touches[1].clientY as number}
        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2
        if (this.initialPinchDistance == null) {
            this.initialPinchDistance = currentDistance
        } else {
            this.adjustZoom(null, currentDistance / this.initialPinchDistance)
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



