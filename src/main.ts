import {DotsAndBoxes} from "./dotsAndBoxes.ts";
import {Parser} from "./parser/parser.ts";
import {Point} from "./shared/point.ts";


class DotsAndBoxesElement extends HTMLElement {
    static observedAttributes = ["color", "border", "code", "width", "height", 'debug'];
    dotsAndBoxes!: DotsAndBoxes
    code: string = ''
    color: string = 'whitesmoke'
    debug: boolean = false
    border: string =  '1px solid #ccc;'
    defaultWidth: number =  100
    defaultHeight: number =  100

    constructor() {
        super();
    }

    reset() {
        if (this.code && this.dotsAndBoxes) {
            const model = new Parser().parse(this.code)
            this.dotsAndBoxes.apply(model);
            this.dotsAndBoxes.showDebug = this.debug
            const offset = new Point(this.offsetLeft, this.offsetTop)
            this.dotsAndBoxes.updateCanvasPositionAndSize(offset, this.color)
            this.dotsAndBoxes.draw()
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 0;border: ${this.border}; }
      </style>
      <div>
        <canvas id="can"></canvas>
        <div id="menu"></div>
      </div>
    `;
        const canvas = this.shadowRoot.getElementById('can') as HTMLCanvasElement
        console.log(this.offsetWidth)
        canvas.width =  this.offsetWidth ? this.offsetWidth -2 : this.defaultWidth
        canvas.height = this.offsetHeight ? this.offsetHeight -2 : this.defaultHeight
        canvas.style.background = this.color
        canvas.style.padding = '0'
        canvas.style.margin = '0'
        canvas.style.overflow = 'hidden'
        canvas.style.userSelect = 'none'


        this.buildMenu(this.shadowRoot.getElementById('menu'))
        this.dotsAndBoxes = new DotsAndBoxes(canvas);
        this.reset()
    }

    buildMenu(menu: HTMLElement) {
        const backward = document.createElement("button");
        backward.onclick = (_) => this.dotsAndBoxes.back()
        backward.textContent = '◀'
        menu.append(backward)
        const pause = document.createElement("button");
        pause.onclick = (_) => this.dotsAndBoxes.togglePause()
        pause.textContent = "◼"
        menu.append(pause)
        const forward = document.createElement("button");
        forward.onclick = (_) => this.dotsAndBoxes.forward()
        forward.append('▶')
        menu.append(forward)


        const panZoomTool = document.createElement("button");
        panZoomTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.PAN_ZOOM_TOOL)
        panZoomTool.append('↹')
        menu.append(panZoomTool)

        const dotTool = document.createElement("button");
        dotTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.DOT_TOOL)
        dotTool.append('o')
        menu.append(dotTool)


        const boxTool = document.createElement("button");
        boxTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.BOX_TOOL)
        boxTool.append('◻')
        menu.append(boxTool)

    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'code') {
            this.code = newValue
        }

        if (name == 'color') {
            this.color = newValue
        }

        if (name == 'border') {
            this.border = newValue
        }

        if (name == 'debug') {
            this.debug = newValue.toLowerCase() == 'true' || newValue == '1'
        }
    }
}

customElements.define("dots-and-boxes", DotsAndBoxesElement);
