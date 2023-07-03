export class Dots {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    private zoom = 1
    private MAX_ZOOM = 5
    private MIN_ZOOM = 0.1
    private SCROLL_SENSITIVITY = 0.0025
    private isDragging = false
    private dragStart = {x: 0, y: 0}
    private initialPinchDistance: number = 0
    private lastZoom = this.zoom
    private dots: Dot[] = []
    private origin = {x: window.innerWidth / 2, y: window.innerHeight / 2}
    private offset = {
        x: 0, y: 0
    }

    constructor(canvasId: string) {
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
            this.adjustZoom(e.deltaY * this.SCROLL_SENSITIVITY, 1))
    }

    public draw() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        const scale = this.zoom

        const translateVec = {
            x: this.offset.x + this.origin.x,
            y: this.offset.y + this.origin.y,
        }

        const mat_transform = new DOMMatrix([
            scale, 0, //  Sx  Qx
            0, scale, //  Qy  Sy
            translateVec.x, translateVec.y, //  Tx  Ty
        ])
        this.ctx.setTransform(mat_transform)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "#700c0c"
        this.drawRect(-50, -50, 100, 100)
        this.ctx.beginPath()
        this.ctx.lineWidth = 0.5
        this.ctx.strokeStyle = "black"
        for (let i = -100; i < 100; i += 10) {
            this.ctx.moveTo(i * 10, -500);
            this.ctx.lineTo(i * 10, 500);
            this.ctx.stroke()
        }
        this.ctx.closePath()
        this.ctx.fillStyle = "#a211dc"
        this.drawText("Simple Pan and Zoom Canvas", -255, -100, 32,
            "courier")
        for (const dot of this.dots) {
            this.drawDot(dot)
        }
        requestAnimationFrame(() => this.draw())
    }

    private getEventLocation(e: any) {
        if (e.touches && e.touches.length == 1) {
            return {x: e.touches[0].clientX, y: e.touches[0].clientY}
        } else if (e.clientX && e.clientY) {
            return {x: e.clientX, y: e.clientY}
        }
    }

    drawRect(x: number, y: number, width: number, height: number) {
        this.ctx.fillRect(x, y, width, height)
    }

    drawText(text: string, x: number, y: number, size: number, font:
        string) {
        this.ctx.font = `${size}px ${font}`
        this.ctx.fillText(text, x, y)
    }

    drawDot(dot: Dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = dot.color;
        this.ctx.fill();
        this.ctx.closePath()
    }

    private onPointerDown(e: MouseEvent) {
        this.isDragging = true
        let point = this.getEventLocation(e)!
        this.dragStart = {x: point.x - this.offset.x, y: point.y - this.offset.y}
        console.log(this.zoom, this.offset.x, "client x=" + point.x,)
        this.dots.push({x: (this.dragStart.x - this.origin.x)/this.zoom, y: (this.dragStart.y - this.origin.y)/this.zoom, size: 10, color: "red"})
    }

    private onPointerUp() {
        this.isDragging = false
        this.initialPinchDistance = 0
        this.lastZoom = this.zoom
    }

    private onPointerMove(e: any) {
        if (this.isDragging) {
            let point = this.getEventLocation(e)!
            this.offset.x = point.x - this.dragStart.x
            this.offset.y = point.y - this.dragStart.y
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
// This is distance squared, but no need for an expensive sqrt as it's only used in ratio
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
            this.zoom = Math.min(this.zoom, this.MAX_ZOOM)
            this.zoom = Math.max(this.zoom, this.MIN_ZOOM)
        }
    }
}

interface Dot {
    x: number
    y: number
    color: string
    size: number
}


////

//
// const animate = function(dt) {
//     clear()
//     const scale = 1.5
//     const translationFactor = {
//         x: Math.sin(dt * 0.001) * 50,
//         y: -Math.cos(dt * 0.001) * 50
//     }
//
//     const origin = {
//         x: (canvas.width / 2),
//         y: (canvas.height / 2)
//     }
//
//     const offset = {
//         x: (1 - scale) * origin.x,
//         y: (1 - scale) * origin.y
//     }
//
//
//     const translateVec = {
//         x: translationFactor.x + offset.x,
//         y: translationFactor.y + offset.y,
//     }
//
//     const mat_transform = new DOMMatrix([
//         scale, 0, //  Sx  Qx
//         0, scale, //  Qy  Sy
//         translateVec.x, translateVec.y, //  Tx  Ty
//     ])
//     ctx.setTransform(mat_transform)
//     drawGrid()
//     ctx.setTransform(1, 0, 0, 1, 0, 0)
//     window.requestAnimationFrame(animate)
// https://farazzshaikh.medium.com/affine-transformations-pan-zoom-skew-96a3adf38eb2