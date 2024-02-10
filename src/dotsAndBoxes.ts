import {Point} from "./shared/point.ts"
import {Tool} from "./shared/tool.ts"
import {Step} from "./shared/step.ts"
import {DEFAULT_FONT, MAX_ZOOM, MIN_ZOOM, SCROLL_SENSITIVITY, TITLE_FONT_SIZE} from "./shared/constants.ts"
import {DotTool} from "./tools/dotTool.ts"
import {EmptyTool} from "./shared/emptyTool.ts"
import {PanZoomTool} from "./tools/panZoomTool.ts"
import {BoxTool} from "./tools/boxTool.ts"
import {StepState} from "./shared/stepState.ts"
import {StepDirection} from "./shared/stepDirection.ts"
import {Easing, EasingType} from "./shared/easingFunctions.ts"
import {DotsAndBoxesModel} from "./shared/dotsAndBoxesModel.ts";

export class DotsAndBoxes {
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D
    private _width = 100
    private _height = 100
    public model: DotsAndBoxesModel = new DotsAndBoxesModel('', [], [])
    public isDragging = false
    private initialPinchDistance: number = 0
    private lastZoom = this.model.zoom
    private fps = 1
    private lastTime: any = 0
    private stepStartTime: number = 0
    private easingFunc: (x: number) => number = Easing.getEasingByType(EasingType.IN_QUAD)
    private inverseEasingFunc: (x: number) => number = Easing.getInverseEasingByType(EasingType.IN_QUAD)
    public showDebug = true
    public title = ''
    public marginLeft = 0
    public marginTop = 0
    public autoPlay: boolean = false
    public readonly EMPTY_TOOL: string = "empty-tool"
    public readonly DOT_TOOL: string = "dot-tool"
    public readonly BOX_TOOL: string = "box-tool"
    public readonly PAN_ZOOM_TOOL: string = "pan-zoom-tool"
    private panZoomTool = new PanZoomTool()
    private tools: Map<string, Tool> = new Map([
        [this.EMPTY_TOOL, new EmptyTool()],
        [this.DOT_TOOL, new DotTool()],
        [this.BOX_TOOL, new BoxTool()],
        [this.PAN_ZOOM_TOOL, this.panZoomTool]
    ])
    private tool: Tool = this.panZoomTool

    private steps: Step[] = []
    private currentStepIndex = 0
    private _requestedStepProgress = 0

    // noinspection JSUnusedGlobalSymbols
    public get requestedStepProgress(): number {
        return this._requestedStepProgress
    }

    public set requestedStepProgress(newVal: number) {
        this._requestedStepProgress = newVal
    }

    public get zoom(): number {
        return this.model.zoom
    }

    public set zoom(newZoom: number) {
        this.model.zoom = newZoom
    }

    private currentStep = new Step()

    public initModel(model: DotsAndBoxesModel) {
        this.steps = []
        this.title = ''
        this.currentStepIndex = 0
        this._requestedStepProgress = 0;
        this.model = model
        this.steps = model.steps
        for (let tool of this.tools.values()) {
            tool.updateModel(this.model)
        }
    }

    public apply(model: DotsAndBoxesModel) {
        this.initModel(model)
        if (model.title) {
            this.title = model.title
        }
        this.selectStep(0)
        this.currentStep.init()
    }

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')! as CanvasRenderingContext2D
        this.canvas = canvas
        this.attachCanvasEventHandlers()
    }

    public updatePositionAndSize(offset: Point) {
        const style = getComputedStyle(this.canvas)
        this._width = parseInt(style.width, 10)
        this._height = parseInt(style.height, 10)
        this.marginLeft = parseInt(style.marginLeft, 10) + offset.x
        this.marginTop = parseInt(style.marginTop, 10) + offset.y
        this.model.origin = new Point(this._width / 2, this._height / 2)
        this.model.offset = new Point(this._width / 2, this._height / 2)
    }

    private attachCanvasEventHandlers() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if (!isMobile) {
            this.addCanvasEvent('mousedown', (e: any) => this.onPointerDown(e))
        }
        this.addCanvasEvent('touchstart', (e: any) => this.handleTouch(e, this.onPointerDown))
        this.addCanvasEvent('mouseup', (_: any) => this.onPointerUp())
        this.addCanvasEvent('touchend', (e: any) => this.handleTouch(e, this.onPointerUp))
        this.addCanvasEvent('mousemove', (e: any) => this.onPointerMove(e))
        this.addCanvasEvent('touchmove', (e: any) => this.handleTouch(e, this.onPointerMove))
        this.addCanvasEvent('wheel', (e: any) => this.handleScroll(e))
    }

    private addCanvasEvent(eventName: string, lambda: any) {
        this.canvas.addEventListener(eventName, lambda)
    }

    selectTool(toolName: string) {
        if (this.tools.has(toolName)) {
            this.tool = this.tools.get(toolName)!
        }
    }

    private updateStartTime() {
        if (this.currentStep.direction == StepDirection.FORWARD) {
            this.stepStartTime = this.lastTime - (this.inverseEasingFunc(this.requestedStepProgress) * this.currentStep.duration)
        } else if (this.currentStep.direction == StepDirection.BACKWARD) {
            this.stepStartTime = this.lastTime - ((1 - this.inverseEasingFunc(this.requestedStepProgress)) * this.currentStep.duration)
        }
    }

    private selectStep(index: number) {
        this.currentStepIndex = index
        this.currentStep = this.steps[this.currentStepIndex]
    }

    private nextStep() {
        if (this.currentStep.state == StepState.END && this.currentStepIndex < this.steps.length - 1) {
            this.selectStep(this.currentStepIndex + 1)
            this.currentStep.init()
            this._requestedStepProgress = 0
        }
    }

    private previousStep() {
        if (this.currentStep.state == StepState.START) {
            if (this.currentStepIndex > 0) {
                this.selectStep(this.currentStepIndex - 1)
                this._requestedStepProgress = 1
            }
        }
    }

    public fastForward() {
        this.autoPlay = true
        this.singleForward()
    }

    public fastBackward() {
        this.autoPlay = true
        this.singleBackward()
    }

    private singleForward() {
        this.nextStep()
        this.currentStep.forward()
        this.updateStartTime()
        this.currentStep.run()
    }

    private singleBackward() {
        this.previousStep()
        this.currentStep.backward()
        this.updateStartTime()
        this.currentStep.run()
    }

    public forward() {
        this.autoPlay = false
        this.singleForward()
    }

    public backward() {
        this.autoPlay = false
        this.singleBackward()
    }

    public deleteSelected() {
        this.togglePause()
        this.model.deleteSelected()
    }

    public togglePause() {
        this.updateStartTime()
        this.currentStep.togglePause()
        if (this.currentStep.state == StepState.STOPPED) {
            this.autoPlay = false
        }
    }

    private drawDebug(time: number) {
        this.fps = 1 / ((time - this.lastTime) / 1000)
        this.drawText(`fps: ${Math.round(this.fps)} zoom: ${Math.round(this.model.zoom * 100) / 100} step: ${this.currentStepIndex} prog: ${Math.round(this._requestedStepProgress * 100) / 100}`, 0, 10, 12, DEFAULT_FONT)
    }

    draw(time: number) {
        this.canvas.width = this._width
        this.canvas.height = this._height
        if (this.showDebug) {
            this.drawDebug(time)
        }
        if (this.title) {
            this.drawText(this.title, 20, 30, TITLE_FONT_SIZE, DEFAULT_FONT)
        }
        this.ctx.translate(this.model.origin.x, this.model.origin.y)
        this.ctx.scale(this.model.zoom, this.model.zoom)
        this.ctx.translate(-this.model.origin.x + this.model.offset.x, -this.model.origin.y + this.model.offset.y)
        if (this.currentStep && this.currentStep.direction != StepDirection.NONE && this.currentStep.state != StepState.STOPPED) {
            this.setRequestedProgressByTime()
        }
        this.updateProgress()
        for (const control of this.model.controls) {
            if (control.visible) {
                control.draw(this.ctx)
            }
        }
        this.lastTime = time
        requestAnimationFrame((evt) => this.draw(evt))
    }

    setRequestedProgressByTime() {
        if (this.currentStep.direction == StepDirection.FORWARD) {
            this._requestedStepProgress = this.easingFunc((this.lastTime - this.stepStartTime) / this.currentStep.duration)
        } else if (this.currentStep.direction == StepDirection.BACKWARD) {
            this._requestedStepProgress = this.easingFunc((this.currentStep.duration - (this.lastTime - this.stepStartTime)) / this.currentStep.duration)
        }
        if (this._requestedStepProgress <= 0.001 || this._requestedStepProgress > 1) {
            this._requestedStepProgress = this._requestedStepProgress <= 0.001 ? 0 : 1
        }
    }

    private updateProgress() {
        if (this.currentStep.progress != this._requestedStepProgress) {
            this.currentStep.progress = this._requestedStepProgress
            if (this.autoPlay) {
                this.handleAutoPlay()
            }
        }
    }

    private handleAutoPlay() {
        if (this.currentStep.state == StepState.END && this.currentStepIndex < this.steps.length - 1) {
            this.singleForward()
        } else if (this.currentStep.state == StepState.START && this.currentStepIndex > 0) {
            this.singleBackward()
        }
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
            clientPoint.x / this.model.zoom - this.model.offset.x + this.model.origin.x - this.model.origin.x / this.model.zoom,
            clientPoint.y / this.model.zoom - this.model.offset.y + this.model.origin.y - this.model.origin.y / this.model.zoom
        ))
    }

    private onPointerUp() {
        this.isDragging = false
        this.initialPinchDistance = 0
        this.lastZoom = this.model.zoom
    }

    private onPointerMove(e: any) {
        e.preventDefault()

        if (this.isDragging) {
            let clientPoint = this.getEventLocation(e)!
            this.tool.move(new Point(
                clientPoint.x / this.model.zoom + this.model.origin.x - this.model.origin.x / this.model.zoom,
                clientPoint.y / this.model.zoom + this.model.origin.y - this.model.origin.y / this.model.zoom
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
                this.model.zoom -= zoomAmount
            } else if (zoomFactor) {
                this.model.zoom = zoomFactor * this.lastZoom
            }
            this.model.zoom = Math.min(this.model.zoom, MAX_ZOOM)
            this.model.zoom = Math.max(this.model.zoom, MIN_ZOOM)
        }
    }


}



