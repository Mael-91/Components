import DOMTimer from "../utils/time";

export default class TextareaAutoGrow extends HTMLTextAreaElement {

    constructor() {
        super();
        this.onFocus = this.onFocus.bind(this)
        this.autogrow = this.autogrow.bind(this)
        this.onResize = DOMTimer.debounce(this.onResize.bind(this), 300)
    }

    connectedCallback () {
        this.addEventListener('focus', this.onFocus)
    }

    disconnectedCallback () {
        window.removeEventListener('resize', this.onResize)
    }

    onFocus () {
        this.autogrow()
        this.style.boxSizing = 'border-box'
        window.addEventListener('resize', this.onResize)
        this.addEventListener('input', this.autogrow)
        this.removeEventListener('focus', this.onFocus)
    }

    onResize () {
        this.autogrow()
    }

    autogrow () {
        this.style.height = 'auto'
        this.style.height = this.scrollHeight + 'px'
        this.removeEventListener('focus', this.onFocus)
    }
}

customElements.define('textarea-autogrow', TextareaAutoGrow, {extends: 'textarea'})