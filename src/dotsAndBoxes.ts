import {Point} from "./shared/point.ts"
import {Tool} from "./shared/tool.ts"
import {
    DEFAULT_FONT,
    MAX_ZOOM,
    MIN_ZOOM,
    SCROLL_SENSITIVITY,
} from "./shared/constants.ts"
import {DotTool} from "./tools/dotTool.ts"
import {EmptyTool} from "./shared/emptyTool.ts"
import {PanZoomTool} from "./tools/panZoomTool.ts"
import {BoxTool} from "./tools/boxTool.ts"
import {DotsAndBoxesModel} from "./shared/dotsAndBoxesModel.ts";

export class DotsAndBoxes {
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D
    public model: DotsAndBoxesModel = new DotsAndBoxesModel('', [], [])
    public isDragging = false
    private initialPinchDistance: number = 0
    private lastZoom = this.model.zoom
    private fps = 1
    public showDebug = false
    public showGrid = false
    public marginLeft = 0
    public marginTop = 0
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
    public pointerPosition: Point = Point.zero()
    public rect: Point = Point.zero()

    // noinspection JSUnusedGlobalSymbols
    public get requestedStepProgress(): number {
        return this.model.requestedStepProgress
    }

    public set requestedStepProgress(newVal: number) {
        this.model.requestedStepProgress = newVal
    }

    public get zoom(): number {
        return this.model.zoom
    }

    public set zoom(newZoom: number) {
        this.model.zoom = newZoom
    }

    public initModel(model: DotsAndBoxesModel) {
        this.requestedStepProgress = 0;
        this.model = model
        this.model.currentStepIndex = 0
        for (let tool of this.tools.values()) {
            tool.updateModel(this)
        }
    }

    public apply(model: DotsAndBoxesModel) {
        this.initModel(model)
        if (this.model.steps.length > 0) {
            this.model.selectStep(0)
            this.model.currentStep.init()
        }
    }

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')! as CanvasRenderingContext2D
        this.canvas = canvas
        this.attachCanvasEventHandlers()
    }

    public updatePositionAndSize() {
        const boundingRect = this.canvas.getBoundingClientRect()
        this.model.updateWidthAndHeight(boundingRect.width, boundingRect.height)
    }

    private updatePointerPosition(x: any, y: any) {
        this.pointerPosition.x = x - this.rect.x
        this.pointerPosition.y = y - this.rect.y
    }

    private attachCanvasEventHandlers() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if (!isMobile) {
            this.addCanvasEvent('mousedown', (e: any) => {
                e.preventDefault()
                e.stopPropagation()
                this.updatePointerPosition(e.x, e.y)
                this.onPointerDown()
            })
        }
        this.addCanvasEvent('touchstart', (e: any) => this.handleTouch(e, this.onPointerDown))
        this.addCanvasEvent('mouseup', (_: any) => this.onPointerUp())
        this.addCanvasEvent('touchend', (e: any) => this.handleTouch(e, this.onPointerUp))
        this.addCanvasEvent('mousemove', (e: any) => {
            e.preventDefault()
            e.stopPropagation()
            this.updatePointerPosition(e.x, e.y)
            this.onPointerMove()
        })
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

    resetTool() {
        this.selectTool(this.PAN_ZOOM_TOOL)
    }

    public fastForward() {
        this.model.autoPlay = true
        this.model.singleForward()
    }

    public fastBackward() {
        this.model.autoPlay = true
        this.model.singleBackward()
    }

    public forward() {
        this.model.autoPlay = false
        this.model.singleForward()
    }

    public backward() {
        this.model.autoPlay = false
        this.model.singleBackward()
    }

    public deleteSelected() {
        this.togglePause()
        this.model.deleteSelected()
    }

    public togglePause() {
        this.model.togglePause()
    }

    private drawDebug(time: number) {
        this.fps = 1 / ((time - this.model.lastTime) / 1000)
        const x = this.model.width - 210
        this.drawText(`fps: ${Math.round(this.fps)} zoom: ${Math.round(this.model.zoom * 100) / 100} step: ${this.model.currentStepIndex} prog: ${Math.round(this.model.requestedStepProgress * 100) / 100}`, x, 10, 10, DEFAULT_FONT)
    }

    draw(time: number) {
        this.canvas.width = this.model.width
        this.canvas.height = this.model.height
        if (this.showDebug) {
            this.drawDebug(time)
        }

        this.ctx.translate(this.model.origin.x, this.model.origin.y)
        this.ctx.scale(this.model.zoom, this.model.zoom)
        this.ctx.translate(-this.model.origin.x + this.model.offset.x, -this.model.origin.y + this.model.offset.y)
        this.model.updateRequestedProgressIfInMove()
        this.model.updateProgress()
        if (this.showGrid) {
            this.drawGrid()
        }
        for (const control of this.model.controls) {
            if (control.visible) {
                control.draw(this.ctx)
            }
        }
        this.model.lastTime = time
        requestAnimationFrame((evt) => this.draw(evt))
    }

    drawText(text: string, x: number, y: number, size: number, font: string) {
        this.ctx.font = `${size}px ${font}`
        this.ctx.fillText(text, x, y)
    }

    drawGrid() {
        const halfSize = 5
        const cellSize = 50
        const maxSize = halfSize * cellSize
        const minSize = -maxSize
        for (let i = minSize; i <= maxSize; i += cellSize) {
            this.drawLine(i, minSize, i, maxSize);
            this.drawLine(minSize, i, maxSize, i);
        }
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        const ctx = this.ctx
        ctx.strokeStyle = 'black'
        ctx.beginPath();
        ctx.lineWidth = x1 == 0 || y1 == 0 ? 1 : 0.4
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    private onPointerDown() {
        this.isDragging = true
        const scaledPoint = new Point(
            this.pointerPosition.x / this.model.zoom - this.model.offset.x + this.model.origin.x - this.model.origin.x / this.model.zoom,
            this.pointerPosition.y / this.model.zoom - this.model.offset.y + this.model.origin.y - this.model.origin.y / this.model.zoom
        )
        this.tool.click(scaledPoint)
    }

    private onPointerUp() {
        this.isDragging = false
        this.initialPinchDistance = 0
        this.lastZoom = this.model.zoom
    }

    private onPointerMove() {
        if (this.isDragging) {
            this.tool.move(new Point(
                this.pointerPosition.x / this.model.zoom + this.model.origin.x - this.model.origin.x / this.model.zoom,
                this.pointerPosition.y / this.model.zoom + this.model.origin.y - this.model.origin.y / this.model.zoom
            ))
        }
    }

    private handleTouch(e: any, singleTouchHandler: any) {
        e.stopPropagation()
        e.preventDefault()
        if (e.touches.length == 1) {
            this.updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY)
            singleTouchHandler.call(this)
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



