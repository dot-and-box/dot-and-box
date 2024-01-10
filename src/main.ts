import {DotsAndBoxes} from "./dotsAndBoxes.ts";
import {Parser} from "./parser/parser.ts";
import {Point} from "./shared/point.ts";


class DotsAndBoxesElement extends HTMLElement {
    static observedAttributes = ["color", "code", "width", "height", 'debug'];
    dotsAndBoxes!: DotsAndBoxes
    code: string = ''
    debug: boolean = false

    constructor() {
        super();
    }

    reset() {
        if (this.code) {
            const model = new Parser().parse(this.code)
            this.dotsAndBoxes.apply(model);
            this.dotsAndBoxes.showDebug = this.debug
            this.dotsAndBoxes.updateCanvasPositionAndSize(new Point(this.offsetLeft, this.offsetTop),  this.attributes.getNamedItem('color')!.value)
            this.dotsAndBoxes.draw()
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"});
        const wrapper = document.createElement("div");
        const canvas = document.createElement("canvas");
        canvas.width = this.attributes['width'].value
        canvas.height = this.attributes['height'].value
        canvas.style.background = 'whitesmoke'
        canvas.style.padding = '0'
        canvas.style.margin = '0'
        canvas.style.overflow = 'hidden'
        canvas.style.userSelect = 'none'
        wrapper.append(canvas)
        wrapper.append(this.buildMenu())
        shadow.append(wrapper)
        this.dotsAndBoxes = new DotsAndBoxes(canvas);
        this.reset()

    }

    buildMenu(): HTMLElement {
        const menu = document.createElement("div");
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

        return menu
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log(`Attribute ${name} has changed.`);

        if (name == 'code') {
            this.code = newValue
            this.reset()
        }

        if (name == 'debug') {
            this.debug = newValue.toLowerCase() == 'true' || newValue == '1'
            this.reset()
        }
    }
}

customElements.define("dots-and-boxes", DotsAndBoxesElement);
