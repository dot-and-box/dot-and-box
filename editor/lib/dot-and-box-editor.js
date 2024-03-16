import * as Prism from './prism.js'

class DotAndBoxEditor extends HTMLElement {
    static observedAttributes = ["code", "readonly", 'attach-selector']

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        this.code = ''
        const shadow = this.attachShadow({mode: "open"})
        shadow.innerHTML = `
      <link href="./lib/prism.css" rel="stylesheet" type="text/css">  

      <style>
        :host { display: block;  padding: 0; }
        .content-wrapper {
          overflow: auto;
        }
        .editor {
          line-height:1.2em;
          background-size:2.4em 2.4em;
          background-origin:content-box;
          counter-reset: line;
          text-align:justify;
          font-family: monospace;
          overflow: auto;
          width: max-content
        }        
        [contenteditable]:focus { 
          outline: 0 solid transparent; 
        }   
        .menu-wrapper {
          height: 48px;
          margin-top: 0;
          margin-left: 0;
          position: relative;
          display: flex;
          gap: 5px;
          flex-wrap: nowrap;
          justify-items: center;
          align-items: center;
          padding-left: 5px;
          padding-right: 5px;
          border-bottom: 1px solid #ccc;
        }     
       
        .separator {
          flex-grow:1;
        }
        .right-menu {
          flex-grow: ;
          display: flex;          
          width: max-content            
        }
        .menu-wrapper button {
          width: 36px;
          height: 36px;
          padding: 0;
          border-radius: 50%;
          border: 1px solid lightgray;
          background-color: transparent;
        }
        
        .button-icon {
          fill: rgba(23,23,23,0.7);       
        }
        .menu-wrapper button:hover {
          border: 1px solid gray ;
        }
        .editor .token {
            font-weight: bold;
        }
      </style>
      <script src="prism.js"></script>
      <div class="menu-wrapper"> 
          <button id="run-code" title="run code">  
        <svg class="button-icon" viewBox="0 0 36 36">       
           <path d="M 12 10 L 27 17 L 12 24 Z"/>           
        </svg></button>
          <div><input type="checkbox" id="autoplay" title="show controls" checked>autoplay</div>
          <span class="separator"></span>
          <div><input type="checkbox" id="show-grid" title="show grid">grid</div>
          <div><input type="checkbox" id="show-controls" title="show controls" checked>controls</div>
          <div><input type="checkbox" id="show-experimental" title="show controls">experimental</div>
          <div class="right-menu"><button id="copy-clipboard" title="copy to clipboard" >📋</button></div> 
        </div>
      <div class="content-wrapper">      
        <pre class="editor" spellcheck=false contenteditable></pre>
      </div>
     `
        const clipBoardButton = this.getControl('#copy-clipboard')
        clipBoardButton.onclick = (_) => this.copyToClipBoard(this.code)

        const runCodeButton = this.getControl('#run-code')
        runCodeButton.onclick = (_) => this.runCode()

        const showGridCheckBox = this.getControl('#show-grid')
        showGridCheckBox.oninput = (v) => {
            if (v.target.checked) {
                this.dotsAndBoxes.setAttribute('grid', true)
            } else {
                this.dotsAndBoxes.removeAttribute('grid')
            }
        }

        const showControlsCheckBox = this.getControl('#show-controls')
        showControlsCheckBox.oninput = (v) => {
            if (v.target.checked) {
                this.dotsAndBoxes.setAttribute('controls', true)
            } else {
                this.dotsAndBoxes.removeAttribute('controls')
            }
        }

        const experimentalCheckBox = this.getControl('#show-experimental')
        experimentalCheckBox.oninput = (v) => {
            if (v.target.checked) {
                this.dotsAndBoxes.setAttribute('experimental', true)
            } else {
                this.dotsAndBoxes.removeAttribute('experimental')
            }
        }

        this.extendDABLang()
        this.updateAttachedControl()
        this.updateCode()
        this.updateReadonly()
    }

    extendDABLang() {
        window.Prism.languages['dabl'] = window.Prism.languages.extend('clike', {
            'keyword': /\b(?:id|ids|at|text|step|title|box|dot|line|dots|boxes|layout|duration|size|color|selected|camera|visible|span|colors)\b/,
        });
    }

    runCode() {
        const newCode = this.updateCodeFromEditor()
        this.updateCode()
        const autoplayCheckBox = this.getControl('#autoplay')
        this.dotsAndBoxes.code = newCode
        if (autoplayCheckBox.checked) {
            setTimeout(()=> this.dotsAndBoxes.fastForward(), 10); //workaround - check out why
        }
    }

    copyToClipBoard(txt) {
        this.updateCodeFromEditor()
        navigator.clipboard.writeText(txt);
    }

    updateCodeFromEditor() {
        const editor = this.getEditor()
        this.code = editor.innerText
        return this.code
    }

    getEditor() {
        return this.getControl('.editor')
    }

    getControl(querySelector) {
        return this.shadowRoot.querySelector(querySelector)
    }

    updateCode() {
        if (this.shadowRoot) {
            const editor = this.getEditor()
            editor.innerHTML = window.Prism.highlight(this.code, window.Prism.languages.dabl, 'dabl')
        }
    }

    updateReadonly() {
        if (this.shadowRoot && this.readonly) {
            const editor = this.shadowRoot.querySelector('.editor')
            editor.removeAttribute("contenteditable")
        }
    }

    updateAttachedControl() {
        if (this.shadowRoot && this.attachSelector) {
            const dab = document.querySelector(this.attachSelector)
            if (dab) {
                this.dotsAndBoxes = dab
                this.reattachHandler()
            }
            if (this.dotsAndBoxes && this.dotsAndBoxes.initialized) {
                this.code = this.dotsAndBoxes.code
                this.updateCode()
            }
        }
    }

    reattachHandler() {
        document.removeEventListener("initialized", this.initializeHandler)
        document.addEventListener("initialized", this.initializeHandler)
    }

    initializeHandler = (evt) => this.onAttachedControlInitialize(evt)

    onAttachedControlInitialize(evt) {
        if (evt.target === this.dotsAndBoxes) {
            this.code = this.dotsAndBoxes.code
            this.dotsAndBoxes.removeAttribute('experimental')
            this.updateCode()
        }
    }

    // noinspection JSUnusedGlobalSymbols
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'code') {
            this.code = newValue
            this.updateCode()
        }
        if (name === 'readonly') {
            this.readonly = newValue != null
            this.updateReadonly()
        }

        if (name === 'attach-selector') {
            this.attachSelector = newValue
            this.updateReadonly()
        }

    }

}

customElements.define('dots-and-boxes-editor', DotAndBoxEditor)