/**
 * Animates a text with a word by word appearance
 * Anime un texte avec une apparition mot par mot
 * @param {String} selector
 */
export function animateText (selector) {
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
 * Surrounds each word with a span (recursively)
 * Entoure chaque mot d'une span (récursivement)
 * @param {Node} element
 * @return {HTMLSpanElement[]}
 */
function spanify (element) {
  // We build a table containing the new structure
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

  // We use this table and inject the elements into the text
  // On utilise ce tableau et on injecte les éléments dans le texte
  element.innerHTML = ''
  elements.forEach(el => {
    element.appendChild(el)
  })

  return spans
}

/**
 * Surround the word with two spans
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
 * @param {Node} element Element à injecter entre chaque element du tableau - Element to be injected between each element of the board
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