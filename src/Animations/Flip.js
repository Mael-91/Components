export default class FlipAnimation {
    constructor () {
        this.duration = 500
        this.position = {}
    }

    /**
     * Memorize the position of our elements
     * Mémorise la position de nos éléments
     * @param {HTMLElement[]} elements
     */
    read (elements) {
        elements.forEach(element => {
            const id = element.getAttribute('id')
            this.position[id] = element.getBoundingClientRect()
        })
    }

    /**
     * Animates elements and their new positions
     * Anime les éléments et leurs nouvelles position
     * @param {HTMLElement[]} elements
     */
    play (elements) {
        elements.forEach(element => {
            const id = element.getAttribute('id')
            const newPosition = element.getBoundingClientRect()
            const oldPosition = this.position[id]
            if (oldPosition === undefined) {
                element.animate([{
                    transform: 'translate(0, -30px)',
                    opacity: 0
                }, {
                    transform: 'none',
                    opacity: 1
                }], {
                    duration: this.duration,
                    easing: 'easing-in-out',
                    fill: 'both'
                })
                return
            }
            const deltaX = oldPosition.x - newPosition.x
            const deltaY = oldPosition.y - newPosition.y
            const deltaW = oldPosition.width / newPosition.width
            const deltaH = oldPosition.height / newPosition.height
            element.animate([{
                transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`
            }, {
                transform: 'none'
            }], {
                duration: this.duration,
                easing: 'ease-in-out',
                fill: 'both'
            })
        })
    }

    /**
     * Remove items with animation
     * Supprime les éléments avec une animation
     * @param {HTMLElement[]} elements
     */
    remove (elements) {
        elements.forEach(element => element.parentNode.appendChild(element))
        elements.forEach(element => {
            const id = element.getAttribute('id')
            const newPosition = element.getBoundingClientRect()
            const oldPosition = this.position[id]
            const deltaX = oldPosition.x - newPosition.x
            const deltaY = oldPosition.y - newPosition.y
            element.animate([{
                transform: `translate(${deltaX}px, ${deltaY}px)`,
                opacity: 1
            }, {
                transform: `translate(${deltaX}px, ${deltaY - 30}px)`,
                opacity: 0
            }], {
                duration: this.duration,
                easing: 'ease-in-out',
                fill: 'both'
            })
            window.setTimeout(function () {
                element.parentNode.removeChild(element)
            }, this.duration)
        })
    }

    /**
     * Replaces elements with an animation effect
     * Remplace les éléments avec un effet d'animation
     * @param {HTMLElement[]} oldElements
     * @param {HTMLElement[]} newElements
     */
    replace (oldElements, newElements) {
        const parent = oldElements[0].parentNode
        const removedElements = []
        this.read(oldElements)
        const newIds = newElements.map(e => {
            parent.appendChild(e)
            return e.getAttribute('id')
        })
        oldElements.forEach(e => {
            const id = e.getAttribute('id')
            if (newIds.includes(id)) {
                parent.removeChild(e)
            } else {
                removedElements.push(e)
            }
        })
        this.remove(removedElements)
        this.play(newElements)
    }
}