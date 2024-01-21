import {Point} from "./shared/point.ts";
import {Tool} from "./shared/tool.ts";
import {DotsAndBoxesModel, Step} from "./shared/step.ts";
import {DEFAULT_FONT, MAX_ZOOM, MIN_ZOOM, SCROLL_SENSITIVITY, TITLE_FONT_SIZE} from "./shared/constants.ts";
import {DotTool} from "./controls/dot/dotTool.ts";
import {EmptyTool} from "./shared/emptyTool.ts";
import {PanZoomTool} from "./panzoom/panZoomTool.ts";
import {BoxTool} from "./controls/box/boxTool.ts";
import {ActionBase} from "./shared/actionBase.ts";
import {Control} from "./controls/control.ts";
import {StepState} from "./shared/stepState.ts";
import {StepDirection} from "./shared/stepDirection.ts";

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
    private last_time: any = 0
    public controls: Control[] = []
    public origin: Point = Point.zero()
    public offset: Point = Point.zero()
    public showDebug = true
    public title = '';
    public marginLeft = 0;
    public marginTop = 0;
    public autoplay: boolean = false

    public readonly EMPTY_TOOL: string = "empty-tool"
    public readonly DOT_TOOL: string = "dot-tool"
    public readonly BOX_TOOL: string = "box-tool"
    public readonly PAN_ZOOM_TOOL: string = "pan-zoom-tool"
    private tool: Tool = new PanZoomTool(this)
    private easingFunc: (step: number, duration: number) => number = this.easeLinear;

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

    public resetModel() {
        this.steps = []
        this.controls = []
        this.title = ''
        this.currentStepIndex = 0;
        this.currentStep = new Step()
    }

    public apply(model: DotsAndBoxesModel) {
        this.resetModel()
        if (model.title) {
            this.title = model.title
        }
        model.controls.forEach(c => this.controls.push(c))
        model.steps.forEach(s => {
            s.init(this)
            this.steps.push(s);
        })
        this.currentStep = this.steps[this.currentStepIndex]
    }

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')! as CanvasRenderingContext2D
        this.canvas = canvas;
        this.attachCanvasEventHandlers()
    }

    public updatePositionAndSize(offset: Point) {
        const style = getComputedStyle(this.canvas);
        this._width = parseInt(style.width, 10)
        this._height = parseInt(style.height, 10)
        this.marginLeft = parseInt(style.marginLeft, 10) + offset.x;
        this.marginTop = parseInt(style.marginTop, 10) + offset.y;
        this.origin = new Point(this._width / 2, this._height / 2)
        this.offset = new Point(this._width / 2, this._height / 2)
    }

    private attachCanvasEventHandlers() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isMobile) {
            this.addCanvasEvent('mousedown', (e: any) => this.onPointerDown(e))
        }
        this.addCanvasEvent('touchstart', (e: any) => this.handleTouch(e, this.onPointerDown))
        this.addCanvasEvent('mouseup', (_: any) => this.onPointerUp())
        this.addCanvasEvent('touchend', (e: any) => this.handleTouch(e, this.onPointerUp))
        this.addCanvasEvent('mousemove', (e: any) => this.onPointerMove(e))
        this.addCanvasEvent('touchmove', (e: any) => this.handleTouch(e, this.onPointerMove))
        this.addCanvasEvent('wheel', (e: any) => this.handleScroll(e))
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
        if (this.currentStep.state == StepState.END && this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++
            this.currentStep = this.steps[this.currentStepIndex]
        }
        this.currentStep.forward()
    }

    back() {
        this.currentStep.reset()
        if (this.currentStep.state == StepState.START) {
            if (this.currentStepIndex > 0) {
                this.currentStepIndex--
                this.currentStep = this.steps[this.currentStepIndex]
            }
        }
        this.currentStep.back()
    }

    drawDebug(time: number) {
        this.fps = 1 / ((time - this.last_time) / 1000);
        this.drawText(`fps: ${Math.round(this.fps)} zoom: ${Math.round(this.zoom * 100) / 100} step: ${this.currentStepIndex} prog: ${Math.round(this.currentStepProgress * 100) / 100}`, 0, 10, 12, DEFAULT_FONT)
    }

    easeLinear(step: number, duration: number): number {
        return step / duration;
    }

    public draw(time: number) {
        this.canvas.width = this._width
        this.canvas.height = this._height
        if (this.showDebug) {
            this.drawDebug(time)
        }
        if (this.title) {
            this.drawText(this.title, 20, 30, TITLE_FONT_SIZE, DEFAULT_FONT)
        }
        this.ctx.translate(this.origin.x, this.origin.y)
        this.ctx.scale(this.zoom, this.zoom)
        this.ctx.translate(-this.origin.x + this.offset.x, -this.origin.y + this.offset.y)
        if (this.currentStep && !this.currentStep.pause) {
            this.updateActions();
        }
        for (const control of this.controls) {
            if (control.visible) {
                control.draw(this.ctx)
            }
        }
        this.last_time = time
        requestAnimationFrame((evt) => this.draw(evt))
    }

    private updateActions() {
        this.currentStep.progress += this.currentStep.direction
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
        if (this.autoplay && this.currentStep.state == StepState.END && this.currentStepIndex < this.steps.length - 1) {
            this.forward()
        }
    }

    private handleAction(action: ActionBase) {
        if (this.currentStep.direction == StepDirection.NONE)
            return

        action.updateValue(this.currentStep.progress)
    }

    private getEventLocation(e: any): Point | null {
        if (e.touches && e.touches.length == 1) {
            return new Point(e.touches[0].clientX + window.scrollX - this.marginLeft, e.touches[0].clientY + window.scrollY - this.marginTop)
        } else if (e.clientX && e.clientY) {
            return new Point(e.clientX + window.scrollX - this.marginLeft, e.clientY + window.scrollY - this.marginTop)
        }
        return null
    }

    drawText(text: string, x: number, y: number, size: number, font: string) {
        this.ctx.font = `${size}px ${font}`
        this.ctx.fillText(text, x, y)
    }

    private onPointerDown(e: MouseEvent) {
        e.preventDefault()

        this.isDragging = true
        let clientPoint = this.getEventLocation(e)
        if (clientPoint == null)
            return

        this.tool.click(new Point(
            clientPoint.x / this.zoom - this.offset.x + this.origin.x - this.origin.x / this.zoom,
            clientPoint.y / this.zoom - this.offset.y + this.origin.y - this.origin.y / this.zoom
        ))
    }

    private onPointerUp() {
        this.isDragging = false
        this.initialPinchDistance = 0
        this.lastZoom = this.zoom
    }

    private onPointerMove(e: any) {
        e.preventDefault()

        if (this.isDragging) {
            let clientPoint = this.getEventLocation(e)!
            this.tool.move(new Point(
                clientPoint.x / this.zoom + this.origin.x - this.origin.x / this.zoom,
                clientPoint.y / this.zoom + this.origin.y - this.origin.y / this.zoom
            ))
        }
    }

    private handleTouch(e: any, singleTouchHandler: any) {
        e.preventDefault()
        if (e.touches.length == 1) {
            singleTouchHandler.call(this, e)
        } else if (e.type == "touchmove" && e.touches.length > 1) {
            this.isDragging = false
            this.handlePinch(e)
        }
    }

    private handlePinch(e: any) {
        const t1 = {
            x: e.touches[0].clientX + window.scrollX - this.marginLeft as number,
            y: e.touches[0].clientY + window.scrollY - this.marginTop as number
        }
        const t2 = {
            x: e.touches[1].clientX + window.scrollX - this.marginLeft as number,
            y: e.touches[1].clientY + window.scrollY - this.marginTop as number
        }
        const currentDistance = (t1.x - t2.x) ** 2 + (t1.y - t2.y) ** 2
        if (this.initialPinchDistance == 0) {
            this.initialPinchDistance = currentDistance
        } else {
            this.adjustZoom(null, currentDistance / this.initialPinchDistance)
        }
    }

    private handleScroll(evt: any) {
        evt.preventDefault()
        this.adjustZoom(evt.deltaY * SCROLL_SENSITIVITY, 1)
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



