export default class Modal extends HTMLElement {

    constructor() {
        super();
        this.height = this.getAttribute('height')
        this.content = this.innerHTML
        this.onEscapeKey = this.onEscapeKey.bind(this)
        this.close = this.close.bind(this)
    }

    connectedCallback () {
        this.style.display = 'none'
        this.querySelector('.modal').style.height = this.height + 'px'
        this.querySelector('#btnClose').addEventListener('click', (e) => {
            e.preventDefault()
            this.close()
        })
        window.addEventListener('keyup', this.onEscapeKey)
    }

    disconnectedCallback () {
        window.removeEventListener('keyup', this.onEscapeKey)
    }

    onEscapeKey (e) {
        if (e.key === 'Escape') {
            e.preventDefault()
            this.close()
        }
    }

    close () {
        const elem = this.querySelector('.modal')
        elem.classList.add('is-closing')
        window.setTimeout(async () => {
            this.style.display = 'none'
            elem.classList.remove('is-closing')
        }, 500)
    }
}

customElements.define('modal-box', Modal)