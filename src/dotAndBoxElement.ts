import {DotAndBox} from "./dotAndBox.ts"
import {Parser} from "./parser/parser.ts"
import {Point} from "./shared/point.ts"
import {
    AUTOPLAY, BORDER, CODE, COLOR, CONTROLS,
    DEBUG, EXPERIMENTAL, GRID, HEIGHT, INITIALIZED, KEYBOARD, STYLE, WIDTH
} from "./shared/elemConstants.ts";


class DotAndBoxElement extends HTMLElement {
    public static readonly ELEM_NAME: string = "dot-and-box"
    public static readonly ON_BEFORE_STEP_FORWARD: string = "on_before_step_forward"
    public static readonly ON_BEFORE_STEP_BACKWARD: string = "on_before_step_backward"
    static observedAttributes = [STYLE, COLOR, BORDER, CODE, WIDTH, HEIGHT, DEBUG, EXPERIMENTAL, CONTROLS, AUTOPLAY, KEYBOARD, GRID]
    dotAndBox!: DotAndBox
    private _code: string = ''
    color: string = 'white'
    debug: boolean = false
    grid: boolean = false
    border: string = '1px solid #ccc'
    defaultWidth: number = 100
    defaultHeight: number = 100
    showControls = false
    extendedMenu = false
    experimental = false
    autoplay = false
    canvas!: HTMLCanvasElement
    keyboard: boolean = false
    _initialized: boolean = false
    _wrapper: any = null

    public get initialized() {
        return this._initialized
    }

    public get code() {
        return this._code
    }

    public set code(newCode: string) {
        this._code = newCode
        this.reset()
    }

    reset() {
        if (this._code && this.dotAndBox) {
            this.updateCanvasStyle(this.canvas)
            this.applyCode()
            this.dotAndBox.showDebug = this.debug
            this.dotAndBox.showGrid = this.grid
            this.dotAndBox.updatePositionAndSize()
            this.dotAndBox.draw(0)
        }
    }

    applyCode() {
        const model = new Parser().parse(this._code)
        model.onBeforeStepForwardCallback = (index) => this.dispatchOnBeforeStepForward(index)
        model.onBeforeStepBackwardCallback = (index) => this.dispatchOnBeforeStepBackward(index)
        model.updateSubtitleCallback = (text) => this.updateSubtitle(text)
        this.updateTitle(model.title)
        this.dotAndBox.apply(model)
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"})
        shadow.innerHTML = `
      <style>
      :host { display: block; padding: 0;border: ${this.border};}
      
      #title-wrapper {
        margin-top: 5px;
        margin-left: 5px;
        margin-right: 5px;
        position: absolute;  
        color: rgba(55,55,55);      
      }
      
      #title {
        font-size: 20px;
        font-weight: bold;
        font-family: Verdana, Geneva, sans-serif
      }
      
      #subtitle {     
        font-size: 18px;      
        font-family: Verdana, Geneva, sans-serif;
      }    
      
      #controls-menu {    
        position: relative;   
        height: 50px;
        left: 0;       
        top: -54px;
        overflow: hidden;
        background-color: transparent;
        display: ${this.showControls ? 'flex' : 'none'};
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
      }               
      
      #controls-menu-extended {    
        position: relative;   
        height: 50px;
        left: 0;
        padding-left: 10px;
        padding-right: 10px;
        top: -154px;
        overflow: hidden;
        background-color: transparent;          
        display: none;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
      }
            
      #controls-menu button, #controls-menu-extended  button {
        color:  rgba(23,23,23,0.7);
        background-color: white;
        font-size: 22px;                 
        width: 36px;
        height: 36px;
        margin-left: 3px;
        margin-right: 3px;
        padding: 0;
        border-radius: 50%;
        border: solid 1px gray;
      }
            
      #controls-menu button:hover  {
        color:  #2d2828;      
        border: solid 1px #2d2828;
      }
      
      .button-icon {
        fill: rgba(23,23,23,0.7);       
      }
      
      button:hover .button-icon {
        fill: black;
        stroke: black;
      }
      
      </style>
      <div id="wrapper">
       <div id="title-wrapper">
         <div id="title"></div>
         <div id="subtitle"></div>
       </div>              
       <canvas id="canvas"></canvas>         
       <div id="controls-menu"></div>
       <div id="controls-menu-extended"></div>
      </div>
    `
        this.buildControls(shadow)
        this.canvas = this.getCanvas(shadow)
        this.dotAndBox = new DotAndBox(this.canvas)
        this.reset()
        this._initialized = true
        this._wrapper = this.shadowRoot!.getElementById('wrapper')
        this._wrapper.dispatchEvent(new CustomEvent(INITIALIZED, {
            bubbles: true,
            cancelable: false,
            composed: true
        }))
        if (this.autoplay) {
            this.fastForward()
        }
        this.onpointerdown = (e) => {
            e.stopPropagation()
            const rect = this.getBoundingClientRect()
            this.dotAndBox.rect = new Point(rect.x, rect.y)
        }
        if (!this.code) {
            this.code = "title: ''"
        }
    }

    getCanvas(shadow: ShadowRoot): HTMLCanvasElement {
        return shadow.getElementById('canvas') as HTMLCanvasElement
    }

    updateCanvasStyle(canvas: HTMLCanvasElement): void {
        canvas.width = this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth
        canvas.height = this.offsetHeight ? this.offsetHeight - 2 : this.defaultHeight
        canvas.style.background = this.color
        canvas.style.padding = '0'
        canvas.style.margin = '0'
        canvas.style.overflow = 'hidden'
        canvas.style.userSelect = 'none'
    }

    updateTitle(title: string) {
        const titleElem = this.shadowRoot!.getElementById('title') as HTMLElement
        titleElem.style.width = `${this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth}px`
        titleElem.innerText = title
    }

    updateSubtitle(subtitle: string) {
        const subtitleElem = this.shadowRoot!.getElementById('subtitle') as HTMLElement
        subtitleElem.style.width = `${this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth}px`
        subtitleElem.innerText = subtitle
    }

    updateControls() {
        const controlsMenu = this.shadowRoot!.getElementById('controls-menu') as HTMLElement
        controlsMenu.style.display = this.showControls ? 'flex' : 'none'
        const experimentalMenu = this.shadowRoot!.getElementById(EXPERIMENTAL) as HTMLElement
        experimentalMenu.style.display = this.experimental ? 'flex' : 'none'
    }

    dispatchOnBeforeStepForward(index: number) {
        const stepSelected = new CustomEvent(DotAndBoxElement.ON_BEFORE_STEP_FORWARD, {
            bubbles: true,
            composed: true,
            detail: {step: index}
        });
        this._wrapper.dispatchEvent(stepSelected)
    }

    dispatchOnBeforeStepBackward(index: number) {
        const stepSelected = new CustomEvent(DotAndBoxElement.ON_BEFORE_STEP_BACKWARD, {
            bubbles: true,
            composed: true,
            detail: {step: index}
        });
        this._wrapper.dispatchEvent(stepSelected)
    }

    buildControls(shadow: ShadowRoot) {
        const menu: HTMLElement = shadow.getElementById('controls-menu') as HTMLElement
        const extendedMenu: HTMLElement = shadow.getElementById('controls-menu-extended') as HTMLElement

        const backward = document.createElement("button")
        backward.onclick = (_) => this.backward()
        backward.innerHTML = ` 
          <svg class="button-icon" viewBox="0 0 36 36">
            <path d="M 9 17 L 24 10 L 24 24 Z"/>           
        </svg>
             `
        menu.append(backward)

        const pause = document.createElement("button")
        pause.onclick = (_) => this.dotAndBox.togglePause()
        pause.innerHTML = ` 
         <svg class="button-icon" viewBox="0 0 36 36">
          <rect x="11" y="11" width="14" height="14" />
         </svg>`
        menu.append(pause)

        const forward = document.createElement("button")
        forward.onclick = (_) => this.forward()
        forward.innerHTML = ` 
        <svg class="button-icon" viewBox="0 0 36 36">       
           <path d="M 12 10 L 27 17 L 12 24 Z"/>           
        </svg>`
        menu.append(forward)

        const restart = document.createElement("button")
        restart.onclick = (_) => this.reset()
        restart.innerHTML = ` 
        <svg class="button-icon" stroke="rgba(23,23,23,0.7)" viewBox="0 0 36 36">
           <path d="M 22 11 L 22 17" stroke-width="2" stroke-linecap="round"/>        
           <path d="M 22 11 L 27 11" stroke-width="2" stroke-linecap="round"/>                   
           <path d="M 23 12 A 8 8 0 1 1 13 12" stroke-width="2" fill="transparent" />
        </svg>`
        menu.append(restart)

        const moreMenuButton = document.createElement("button")
        moreMenuButton.onclick = (_) => this.toggleExtendedMenu()
        moreMenuButton.innerHTML = ` 
        <svg class="button-icon" stroke="rgba(23,23,23,0.7)" viewBox="0 0 36 36">
           <circle cx="10" cy="18" r="1"  />
           <circle cx="18" cy="18" r="1"  />
           <circle cx="26" cy="18" r="1"  />
        </svg>`
        menu.append(moreMenuButton)
        const rangeControl = document.createElement("input")
        rangeControl.id = 'progress-range'
        rangeControl.type = 'range'
        rangeControl.min = '0'
        rangeControl.max = '1'
        rangeControl.step = '0.01'
        rangeControl.value = '0'
        rangeControl.style.height = '100%'
        rangeControl.style.width = '100%'
        rangeControl.oninput = (e: any) => {
            this.dotAndBox.requestedStepProgress = parseFloat(e.target.value)
        }
        extendedMenu.append(rangeControl)

        const experimentalMenu = document.createElement("div")
        experimentalMenu.id = EXPERIMENTAL
        experimentalMenu.style.display = this.experimental ? 'flex' : 'none'

        const dotTool = document.createElement("button")
        dotTool.onclick = (_) => this.dotAndBox.selectTool(this.dotAndBox.DOT_TOOL)
        dotTool.innerHTML = ` 
        <svg class="button-icon" stroke="rgba(23,23,23,0.7)" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="8" stroke-width="2" fill="transparent"   />
        </svg>`
        experimentalMenu.append(dotTool)

        const boxTool = document.createElement("button")
        boxTool.onclick = (_) => this.dotAndBox.selectTool(this.dotAndBox.BOX_TOOL)
        boxTool.innerHTML = ` 
        <svg class="button-icon" stroke="rgba(23,23,23,0.7)" viewBox="0 0 36 36">
            <rect x="11" y="11" width="14" height="14" stroke-width="2" fill="transparent" />
        </svg>`
        experimentalMenu.append(boxTool)

        const printModel = document.createElement("button")
        printModel.onclick = (_) => console.log(this.dotAndBox.model)
        printModel.append('\u{02148}')
        experimentalMenu.append(printModel)
        extendedMenu.append(experimentalMenu)
    }

    toggleExtendedMenu() {
        if (!this.extendedMenu) {
            this.showExtendedMenu()
        } else {
            this.hideExtendedMenu()
        }
    }

    hideExtendedMenu() {
        if (this.extendedMenu) {
            const extendedMenu: HTMLElement = this.shadowRoot!.getElementById('controls-menu-extended') as HTMLElement
            this.extendedMenu = false
            extendedMenu.style.display = 'none'
        }
    }

    showExtendedMenu() {
        if (!this.extendedMenu) {
            const extendedMenu: HTMLElement = this.shadowRoot!.getElementById('controls-menu-extended') as HTMLElement
            const progressRange: HTMLInputElement = this.shadowRoot!.getElementById('progress-range') as HTMLInputElement
            progressRange.value = `${this.dotAndBox.requestedStepProgress}`
            this.extendedMenu = true
            extendedMenu.style.display = 'flex'
        }
    }

    private updateKeyboardHandler() {
        if (this.keyboard) {
            document.addEventListener('keydown', this.keyboardHandlerLambda)
        } else {
            document.removeEventListener('keydown', this.keyboardHandlerLambda)
        }
    }

    keyboardHandlerLambda = (e: any) => this.handleKeyDown(e)

    private handleKeyDown(k: KeyboardEvent) {
        if (k.key === "ArrowLeft") {
            this.dotAndBox.backward()
        } else if (k.key === "ArrowRight") {
            this.dotAndBox.forward()
        } else if (k.key === "Delete") {
            this.dotAndBox.deleteSelected()
        }
    }

    public forward() {
        this.hideExtendedMenu()
        this.dotAndBox.forward()
    }

    public fastForward() {
        this.dotAndBox.fastForward()
    }

    public backward() {
        this.hideExtendedMenu()
        this.dotAndBox.backward()
    }

    public fastBackward() {
        this.dotAndBox.fastBackward()
    }

    resize() {
        if (this.canvas) {
            this.updateCanvasStyle(this.canvas)
            this.dotAndBox.updatePositionAndSize()
        }
    }


    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        switch (name) {
            case STYLE:
                this.resize()
                break
            case CODE:
                this._code = newValue.trim()
                if (this.dotAndBox) {
                    this.applyCode()
                }
                break
            case COLOR:
                this.color = newValue
                break
            case BORDER:
                this.border = newValue
                break
            case CONTROLS:
                this.showControls = newValue != null
                if (this.dotAndBox) {
                    this.updateControls()
                }
                break
            case EXPERIMENTAL:
                this.experimental = newValue != null
                if (this.dotAndBox) {
                    this.updateControls()
                }
                break
            case KEYBOARD:
                this.keyboard = newValue != null
                this.updateKeyboardHandler()
                break
            case AUTOPLAY:
                this.autoplay = newValue != null
                if (this.dotAndBox) {
                    this.fastForward()
                }
                break
            case DEBUG:
                this.debug = newValue != null
                if (this.dotAndBox) {
                    this.dotAndBox.showDebug = this.debug
                }
                break
            case GRID:
                this.grid = newValue != null
                if (this.dotAndBox) {
                    this.dotAndBox.showGrid = this.grid
                }
                break
            default:
                console.log(name, oldValue, newValue)

        }
    }
}

customElements.define(DotAndBoxElement.ELEM_NAME, DotAndBoxElement)
