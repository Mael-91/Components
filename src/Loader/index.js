export default class Loader extends HTMLElement {

    /**
     * @param {String} type
     * @param {String} message
     */
    constructor(type, message) {
        super();
        if (type !== undefined) {
            this.type = type
        } else {
            this.type = this.getAttribute('type')
        }
        if (!message) {
            message = this.innerHTML
        }
        this.message = message
    }

    connectedCallback () {
        this.innerHTML = `<span class="loader ${this.loaderType}">${this.loaderBars(this.loaderType)}</span>${this.message}`
    }

    get loaderType () {
        if (this.type === 'default') {
            return 'loader-default'
        } else if (this.type === 'double') {
            return 'loader-double'
        } else if (this.type === 'circles') {
            return 'loader-circles'
        } else if (this.type === 'circles-double') {
            return 'loader-circles-double'
        } else if (this.type === 'bars') {
            return 'loader-bars'
        } else {
            return 'loader-default'
        }
    }

    loaderBars (type) {
        if (type === 'loader-bars') {
            return '<span></span>'
        } else {
            return ''
        }
    }
}

customElements.define('loader-element', Loader)