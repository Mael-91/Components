const terms = [
    {
        time: 45,
        divide: 60,
        text: 'moins d\'une minute'
    }, {
        time: 90,
        divide: 60,
        text: 'environ une minute'
    }, {
        time: 45 * 60,
        divide: 60,
        text: '%d minutes'
    }, {
        time: 90 * 60,
        divide: 60 * 60,
        text: 'environ une heure'
    }, {
        time: 24 * 60 * 60,
        divide: 60 * 60,
        text: '%d heures'
    }, {
        time: 42 * 60 * 60,
        divide: 24 * 60 * 60,
        text: 'environ un jour'
    }, {
        time: 30 * 24 * 60 * 60,
        divide: 24 * 60 * 60,
        text: '%d jours'
    }, {
        time: 45 * 24 * 60 * 60,
        divide: 24 * 60 * 60 * 30,
        text: 'environ un mois'
    }, {
        time: 365 * 24 * 60 * 60,
        divide: 24 * 60 * 60 * 30,
        text: '%d mois'
    }, {
        time: 365 * 1.5 * 24 * 60 * 60,
        divide: 24 * 60 * 60 * 365,
        text: 'environ un an'
    }, {
        time: Infinity,
        divide: 24 * 60 * 60 * 365,
        text: '%d ans'
    }
]

export default class TimeAgo extends HTMLElement {

    connectedCallback() {
        const date = parseInt(this.getAttribute('data-ago'), 10)
        this.displayUpdate(date);
    }

    disconnectedCallback() {
        window.clearTimeout(this.timer)
    }

    displayUpdate(date) {
        let seconds = Math.floor((new Date().getTime() / 1000 - date))
        let term = null
        for (term of terms) {
            if (Math.abs(seconds) < term.time) {
                break;
            }
        }
        if (seconds > 0) {
            this.innerHTML = 'Il y a ' + term.text.replace('%d', Math.round(seconds / term.divide))
        } else {
            this.innerHTML = 'Dans ' + term.text.replace('%d', Math.round(Math.abs(seconds) / term.divide))
        }
        let nextTrick = Math.abs(seconds) % term.divide
        if (nextTrick === 0) {
            nextTrick = term.divide
        }
        this.timer = window.setTimeout(() => {
            window.requestAnimationFrame(() => {
                this.displayUpdate(date)
            })
        }, nextTrick * 1000)
    };
}

customElements.define('time-ago', TimeAgo);