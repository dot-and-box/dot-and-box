import {Point} from "./shared/point.ts";
import {Tool} from "./shared/tool.ts";
import {DotsAndBoxesModel, Step, StepState} from "./shared/step.ts";
import {DEFAULT_FONT, MAX_ZOOM, MIN_ZOOM, SCROLL_SENSITIVITY, TITLE_FONT_SIZE} from "./shared/constants.ts";
import {DotTool} from "./controls/dot/dotTool.ts";
import {EmptyTool} from "./shared/emptyTool.ts";
import {PanZoomTool} from "./panzoom/panZoomTool.ts";
import {BoxTool} from "./controls/box/boxTool.ts";
import {ActionBase} from "./shared/actionBase.ts";
import {Control} from "./controls/control.ts";

export class DotsAndBoxes {
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D
    private _width = 100;
    private _height = 100;
    public zoom: number = 1
    public isDragging = false
    private initialPinchDistance: number = 0
    private lastZoom = this.zoom
    private fps = 1
    private last_time: number = 0
    public controls: Control[] = []
    public origin: Point = Point.zero()
    public offset: Point = Point.zero()
    public showDebug = true
    public showTitle = false;
    public title = '';
    public marginLeft = 0;
    public marginTop = 0;

    public readonly EMPTY_TOOL: string = "empty-tool"
    public readonly DOT_TOOL: string = "dot-tool"
    public readonly BOX_TOOL: string = "box-tool"
    public readonly PAN_ZOOM_TOOL: string = "pan-zoom-tool"
    private tool: Tool = new PanZoomTool(this)

    private tools: Map<string, Tool> = new Map([
        [this.EMPTY_TOOL, new EmptyTool()],
        [this.DOT_TOOL, new DotTool(this)],
        [this.BOX_TOOL, new BoxTool(this)],
        [this.PAN_ZOOM_TOOL, new PanZoomTool(this)]
    ])
    private steps: Step[] = []
    private currentStepIndex = 0;
    private currentStepProgress = 0;
    private currentStep = new Step()


    public apply(model: DotsAndBoxesModel) {
        this.steps = []
        this.controls = []
        if (model.title) {
            this.showTitle = true
            this.title = model.title
        }
        model.controls.forEach(c => this.controls.push(c))
        model.steps.forEach(s => {
            s.init(this)
            this.steps.push(s);
        })
        this.currentStepIndex = 0;
        this.currentStep = this.steps[this.currentStepIndex]
    }

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')! as CanvasRenderingContext2D
        this.canvas = canvas;
        this.attachCanvasEventHandlers()
    }

    public updateCanvasPositionAndSize(offset: Point, color: string) {
        this.canvas.style.background = color;
        const style = getComputedStyle(this.canvas);
        this._width = parseInt(style.width, 10)
        this._height = parseInt(style.height, 10)
        this.marginLeft = parseInt(style.marginLeft, 10) + offset.x;
        this.marginTop = parseInt(style.marginTop, 10) + offset.y;
        this.origin = new Point(this._width / 2, this._height / 2)
        this.offset = new Point(this._width / 2, this._height / 2)
    }

    private attachCanvasEventHandlers() {
        this.addCanvasEvent('mousedown', (e: any) => this.onPointerDown(e))
        this.addCanvasEvent('touchstart', (e: any) => this.handleTouch(e, this.onPointerDown))
        this.addCanvasEvent('mouseup', (_: any) => this.onPointerUp())
        this.addCanvasEvent('touchend', (e: any) => this.handleTouch(e, this.onPointerUp))
        this.addCanvasEvent('mousemove', (e: any) => this.onPointerMove(e))
        this.addCanvasEvent('touchmove', (e: any) => this.handleTouch(e, this.onPointerMove))
        this.addCanvasEvent('wheel', (e: any) => this.adjustZoom(e.deltaY * SCROLL_SENSITIVITY, 1))
        this.addDocumentEvent('keydown', (e: any) => this.handleKeyDown(e))
    }

    private handleKeyDown(k: KeyboardEvent) {
        if (k.key === "ArrowLeft") {
            this.back()
        } else if (k.key === "ArrowRight") {
            this.forward()
        }
    }

    private addCanvasEvent(eventName: string, lambda: any) {
        this.canvas.addEventListener(eventName, lambda)
    }

    private addDocumentEvent(eventName: string, lambda: any) {
        document.addEventListener(eventName, lambda)
    }

    selectTool(toolName: string) {
        if (this.tools.has(toolName)) {
            this.tool = this.tools.get(toolName)!
        }
    }

    forward() {
        this.currentStep.reset()
        if (this.currentStep.state == StepState.END) {
            if (this.currentStepIndex < this.steps.length - 1) {
                this.currentStepIndex++
                this.currentStep = this.steps[this.currentStepIndex]
            }
        }
        this.currentStep.forward()
    }


    back() {
        this.currentStep.reset()

        if (this.currentStep.state == StepState.START) {
            this.currentStep.actions.forEach(a => a.onPreviousStep())
            if (this.currentStepIndex > 0) {
                this.currentStepIndex--
                this.currentStep = this.steps[this.currentStepIndex]
            }
        }
        this.currentStep.back()
    }

    drawDebug() {
        const time = performance.now()
        this.fps = 1 / ((performance.now() - this.last_time) / 1000);
        this.last_time = time
        this.drawText(`fps: ${Math.round(this.fps)} zoom: ${Math.round(this.zoom * 100) / 100} step: ${this.currentStepIndex} prog: ${Math.round(this.currentStepProgress * 100) / 100}`, 0, 10, 12, DEFAULT_FONT)
    }

    public draw() {
        this.canvas.width = this._width
        this.canvas.height = this._height
        if (this.showDebug) {
            this.drawDebug()
        }
        if (this.showTitle) {
            this.drawText(this.title, 20, 30, TITLE_FONT_SIZE, DEFAULT_FONT)
        }
        this.ctx.translate(this.origin.x, this.origin.y)
        this.ctx.scale(this.zoom, this.zoom)
        this.ctx.translate(-this.origin.x + this.offset.x, -this.origin.y + this.offset.y)

        if (this.currentStep && !this.currentStep.pause) {
            this.updateActions();
        }
        for (const control of this.controls) {
            control.draw(this.ctx)
        }
        requestAnimationFrame(() => this.draw())
    }


    private updateActions() {
        this.currentStep.progress += this.currentStep.progressStep
        if (this.currentStep.progress <= 0 || this.currentStep.progress >= 1) {
            this.currentStep.progress = this.currentStep.progress <= 0 ? 0 : 1
        }
        this.currentStepProgress = this.currentStep.progress

        if (this.currentStep.state == StepState.IN_PROGRESS) {
            for (const action of this.currentStep.actions) {
                this.handleAction(action)
            }
        }
        this.currentStep.updateState()
    }

    private handleAction(action: ActionBase) {
        if (this.currentStep.progressStep == 0)
            return

        action.updateValue(this.currentStep.progress)
    }

    private getEventLocation(e: any): Point | null {
        if (e.touches && e.touches.length == 1) {
            return new Point(e.touches[0].clientX, e.touches[0].clientY)
        } else if (e.clientX && e.clientY) {
            return new Point(e.clientX - this.marginLeft, e.clientY - this.marginTop)
        }
        return null
    }

    drawText(text: string, x: number, y: number, size: number, font: string) {
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
        if (this.currentStep) {
            this.currentStep.togglePause()
        }
    }
}



