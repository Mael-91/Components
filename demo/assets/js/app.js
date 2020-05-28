export class DOMTimer {
  static debounce(callback, delay) {
    let timer;
    return function () {
      const context = this
      const args = arguments
      clearTimeout(timer)
      timer = setTimeout(function () {
        callback.apply(context, args)
      }, delay)
    }
  }
}

export class FlipAnimation {
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

/**
 * Hides an item with a fallback effect
 * Masque un élément avec un effet de repli
 * @param {HTMLElement} element
 * @param {Number} duration
 * @return {Promise<boolean>}
 */
export function slideUp (element, duration = 500) {
  return new Promise(function (resolve, reject) {
    element.style.height = element.offsetHeight + 'px'
    element.style.transitionProperty = 'height, margin, padding'
    element.style.transitionDuration = duration + 'ms'
    element.offsetHeight // redraw
    element.style.overflow = 'hidden'
    element.style.height = 0
    element.style.paddingTop = 0
    element.style.paddingBottom = 0
    element.style.marginTop = 0
    element.style.marginBottom = 0
    window.setTimeout(function () {
      element.style.display = 'none'
      element.style.removeProperty('height')
      element.style.removeProperty('padding-top')
      element.style.removeProperty('padding-bottom')
      element.style.removeProperty('margin-top')
      element.style.removeProperty('margin-bottom')
      element.style.removeProperty('overflow')
      element.style.removeProperty('transition-property')
      element.style.removeProperty('transition-duration')
      resolve(false)
    }, duration)
  })
}

/**
 * Displays an item with a deployment effect
 * Affiche un élément avec un effet de dépliement
 * @param {HTMLElement} element
 * @param {Number} duration
 * @returns {Promise<boolean>}
 */
export function slideDown (element, duration = 500) {
  return new Promise(function (resolve, reject) {
    element.style.removeProperty('display')
    let display = window.getComputedStyle(element).display
    if (display === 'none') display = 'block'
    element.style.display = display
    const height = element.offsetHeight
    element.style.overflow = 'hidden'
    element.style.height = 0
    element.style.paddingTop = 0
    element.style.paddingBottom = 0
    element.style.marginTop = 0
    element.style.marginBottom = 0
    element.offsetHeight // redraw
    element.style.transitionProperty = 'height, margin, padding'
    element.style.transitionDuration = duration + 'ms'
    element.style.height = height + 'px'
    element.style.removeProperty('padding-top')
    element.style.removeProperty('padding-bottom')
    element.style.removeProperty('margin-top')
    element.style.removeProperty('margin-bottom')
    window.setTimeout(function () {
      element.style.removeProperty('height')
      element.style.removeProperty('overflow')
      element.style.removeProperty('transition-duration')
      element.style.removeProperty('transition-property')
      resolve(false)
    }, duration)
  })
}

/**
 * Show or hide an item
 * Affiche ou masque un élément
 * @param {HTMLElement} element
 * @param {Number} duration
 * @return {Promise<boolean>}
 */
export function slideToggle (element, duration = 500) {
  const display = window.getComputedStyle(element).display
  if (display === 'none') {
    window.setTimeout(async () => {
      return slideDown(element, duration)
    })
  } else {
    window.setTimeout(async () => {
      return slideUp(element, duration)
    }, 1000)
  }
}

/**
 * Anime un texte avec une apparition mot par mot
 * @param {String} selector
 */
function animateText (selector) {
  const text = document.querySelector(selector)
  if (text === null) {
    console.error('Impossible de trouver l\'élément ' + selector)
    return
  }

  const spans = spanify(text)
  text.style.opacity = 1
  spans.forEach((span, k) => {
    span.children[0].style.animationDelay = (k * .1) + 's'
  })
}

/**
 * Entoure chaque mot d'une span (récursivement)
 * @param {Node} element
 * @return {HTMLSpanElement[]}
 */
function spanify (element) {
  // On construit un tableau contenant la nouvelle structure
  const children = Array.from(element.childNodes)
  let spans = []
  let elements = []
  children.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const words = child.textContent.split(' ')
      let wordSpans = words.map(wrapWord)
      spans = spans.concat(wordSpans)
      elements = elements.concat(injectElementBetweenItems(wordSpans, document.createTextNode(' ')))
    } else if (child.tagName === 'BR') {
      elements.push(child)
    } else {
      spans = spans.concat(spanify(child))
      elements.push(child)
    }
  })

  // On utilise ce tableau et on injecte les éléments dans le texte
  element.innerHTML = ''
  elements.forEach(el => {
    element.appendChild(el)
  })

  return spans
}

/**
 * Entoure le mot de deux span
 * @param {String} word
 */
function wrapWord(word) {
  const span = document.createElement('span')
  const span2 = document.createElement('span')
  span.appendChild(span2)
  span2.textContent = word
  return span
}

/**
 * @param {Node[]} arr
 * @param {Node} element Element à injecter entre chaque element du tableau
 * @return {Node[]}
 */
function injectElementBetweenItems(arr, element) {
  return arr.map((item, k) => {
    if (k === arr.length - 1) {
      return [item]
    }
    return [item, element.cloneNode()]
  }).reduce((acc, pair) => {
    acc = acc.concat(pair)
    return acc
  }, [])
}

animateText('.word_animation')

export class Loader extends HTMLElement {

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

export class Modal extends HTMLElement {

  constructor() {
    super();
    this.height = this.getAttribute('height')
    this.content = this.innerHTML
    this.onEscapeKey = this.onEscapeKey.bind(this)
    this.close = this.close.bind(this)
  }

  connectedCallback () {
    this.style.display = 'none'
    console.log(this)
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

export class Tabs extends HTMLElement {

  connectedCallback () {
    this.setAttribute('role', 'tablist')
    const tabs = Array.from(this.children)
    const hash = window.location.hash.replace('#', '')
    let currentTab = tabs[0]
    tabs.forEach((tab, i) => {
      const id = tab.getAttribute('href').replace('#', '')
      const tabpanel = document.getElementById(id)
      // L'élément est l'élément à activer par défaut ?
      if (id === hash) {
        currentTab = tab
      }
      if (tab.getAttribute('aria-selected') === 'true' && hash === '') {
        currentTab = tab
      }

      // On ajoute les attributs aria sur l'onglet
      tab.setAttribute('role', 'tablist')
      tab.setAttribute('aria-selected', 'false')
      tab.setAttribute('tabindex', '-1')
      tab.setAttribute('aria-controls', id)
      tab.setAttribute('id', 'tab-' + id)
      // On ajoute les attributs aria sur la table
      tabpanel.setAttribute('role', 'tabpanel')
      tabpanel.setAttribute('aria-labelledby', 'tab-' + id)
      tabpanel.setAttribute('hidden', 'hidden')
      tabpanel.setAttribute('tabindex', '0')

      // Navigation au clavier
      tab.addEventListener('keyup', e => {
        let index = null
        if (e.key === 'ArrowRight') {
          index = i === tabs.length - 1 ? 0 : i + 1
        } else if (e.key === 'ArrowLeft') {
          index = i === 0 ? tabs.length - 1 : i - 1
        } else if (e.key === 'Home') {
          index = 0
        } else if (e.key === 'End') {
          index = tabs.length - 1
        }
        if (index !== null) {
          this.activate(tabs[index])
          tabs[index].focus()
        }
      })

      // Navigation à la souris
      tab.addEventListener('click', e => {
        e.preventDefault()
        this.activate(tab)
      })
    })

    // On active l'onglet qui est censé être actif
    this.activate(currentTab, false)
    // On scroll vers l'onglet actif
    if (currentTab.getAttribute('aria-controls') === hash) {
      window.requestAnimationFrame(() => {
        currentTab.scrollIntoView({
          behavior: 'smooth'
        })
      })
    }
  }

  /**
   * @param {HTMLElement} tab
   * @param {Boolean} changeHash
   */
  activate (tab, changeHash = true) {
    const currentTab = this.querySelector('[aria-selected="true"]')
    if (currentTab !== null) {
      const tabpanel = document.getElementById(currentTab.getAttribute('aria-controls'))
      currentTab.setAttribute('aria-selected', 'false')
      currentTab.setAttribute('tabindex', '-1')
      tabpanel.setAttribute('hidden', 'hidden')
    }
    const id = tab.getAttribute('aria-controls')
    const tabpanel = document.getElementById(id)
    tab.setAttribute('aria-selected', 'true')
    tab.setAttribute('tabindex', '0')
    tabpanel.removeAttribute('hidden')
    if (changeHash) {
      window.history.replaceState({}, '', '#' + id)
    }
  }
}

customElements.define('nav-tabs', Tabs)

export class TextareaAutoGrow extends HTMLTextAreaElement {

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

export class TimeAgo extends HTMLElement {

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

let cards = Array.from(document.querySelectorAll('.card'));
cards.forEach((card) => {
  card.addEventListener('click', function () {
    let flip = new FlipAnimation();
    flip.read(cards);
    flip.remove([card]);
    cards = cards.filter(c => c !== card);
    flip.play(cards);
  })
});

const modalDemo = document.querySelector('#modalBtn')
const modalBox = document.querySelector('#modalDemo')

modalDemo.addEventListener('click', e => {
  e.preventDefault()
  modalBox.style.display = 'block'
  modalBox.setAttribute('aria-hidden', 'false')
})

const modalClose = document.querySelector('#btnClose')

modalClose.addEventListener('click', e => {
  e.preventDefault()
  modalBox.setAttribute('aria-hidden', 'true')
})

const slideUpBtn = document.querySelector('#slideUpbtn')
const slideDownBtn = document.querySelector('#slideDownBtn')
const slideUpBlock = document.querySelector('#slideUpBlock')
const slideDownBlock = document.querySelector('#slideDownBlock')

slideUpBtn.addEventListener('click', e => {
  e.preventDefault()
  window.setTimeout(async () => {
    await slideUp(slideUpBlock)
  }, 500)
})

slideDownBtn.addEventListener('click', e => {
  e.preventDefault()
  window.setTimeout(async () => {
    slideDownBlock.style.display = 'block'
    await slideDown(slideDownBlock)
  }, 500)
})