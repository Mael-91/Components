# JS Components

<div align="center" style="display: flex; justify-content: center">
<img src="https://travis-ci.com/Mael-91/Components.svg?branch=master" style="padding-right: 10px" alt="Travis build">
</div>

Library regrouping various reusable javascript components 

> Be careful, I start in JavaScript, everything is not perfect but as time goes by, there will be improvements in the code.

**Table of contents**
- [Animations](https://github.com/Mael-91/Components#animations)
    - [Flip](https://github.com/Mael-91/Components#flip)
    - [Slide](https://github.com/Mael-91/Components#slide)
    - [Words Animations](https://github.com/Mael-91/Components#words-animations)
- [Loader](https://github.com/Mael-91/Components#loader)
- [Modal](https://github.com/Mael-91/Components#modal)
- [Tabs](https://github.com/Mael-91/Components#tabs)
- [Textarea Auto Grow](https://github.com/Mael-91/Components#textarea-auto-grow)
- [TimeAgo](https://github.com/Mael-91/Components#time-ago)
- [Contribute](https://github.com/Mael-91/Components#contribute)
- [License](https://github.com/Mael-91/Components#license)

# Animations

## Flip

To use the Flip animation on maps (bootstrap for the example) you just have to add this in your JS code (or tag `<script></script>`).

Of course, this animation can be adapted to different HTML elements, we provide you only one example in this documentation

First of all, you need to import the class named FlipAnimation (`import FlipAnimation from @mael/js-components/src/Animations/FlipAnimation.js`) 

```javascript
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
```

## Slide

### SlideUp

Very simple to use, let's take the example on the demonstration table (to be adapted according to your project).

Don't forget to import the desired function (SlideUp, SlideDown, SlideToggle from `@mael-91/js-components/src/Animations/Slide.js`)

For SlideUp

```javascript
const slideUpBtn = document.querySelector('#slideUpbtn')
const slideUpBlock = document.querySelector('#slideUpBlock')

slideUpBtn.addEventListener('click', e => {
  e.preventDefault()
  window.setTimeout(async () => {
    await slideUp(slideUpBlock)
  }, 500)
})
```

For SlideDown

```javascript
const slideDownBtn = document.querySelector('#slideDownBtn')
const slideDownBlock = document.querySelector('#slideDownBlock')

slideDownBtn.addEventListener('click', e => {
  e.preventDefault()
  window.setTimeout(async () => {
    slideDownBlock.style.display = 'block'
    await slideDown(slideDownBlock)
  }, 500)
})
```

For SlideToggle

```javascript
const slideToggleBtn = document.querySelector('#slideToggleBtn')
const slideToggleBlock = document.querySelector('#slideToggleBlock')

slideToggleBtn.addEventListener('click', e => {
  e.preventDefault()
  window.setTimeout(async () => {
    await slideToggle(slideToggleBlock)
  }, 500)
})
```

## Words Animation

You want to animate your sentences, your titles? Use this animation 

Just add a css class on the desired tag and you're done!

```html
<h4 class="word_animation">Word animation</h4>
```

It is also possible to add other HTML tags inside the tag you want to animate

```html
<h4 class="word_animation">Word<br> animation</h4>
<h4 class="word_animation">Word <strong>animation</strong></h4>
```

# Loader 

The Loader component allows you to display different loader, to display it you just have to add the HTML tag 
`<loader-element>` with a type attribute (if not defined, the default loader is

```html
<loader-element>Default loader</loader-element>
<loader-element type="double">Loader double</loader-element>
<loader-element type="circles-double">Loader circles double</loader-element>
<loader-element type="bars">Loader bars</loader-element>
```

You can also add the loader by doing a manipulation of the DOM in JS, nothing simpler, instantiate the class `Loader` and 
pass it in parameter the type of loader, if you want to display a 
message, in second argument, pass your message

```javascript
new Loader('default', 'Default loader')
new Loader('default', 'Loader double')
new Loader('default', 'Loader circles double')
new Loader('default', 'Loader bars')
```

# Modal

To use the modal box, you just have to add this HTML code in your page (modified by your content)

You have to set the `height` attribute of the tag with the size you want

It is also possible to modify the button to close the modal (by adding a svg for example)

```html
<modal-box height="250" id="modalDemo">
    <div class="modal">
        <div class="modal-header">
            <h5 class="modal-title">Modal box Compnent</h5>
            <button class="modal-close" id="btnClose">&times;</button>
        </div>
        <div class="modal-body">
            <p class="modal-text">My modal text</p>
        </div>
    </div>
</modal-box>
```

Then in a script tag or in your JS file add the following 

(You can change the ids)

```javascript
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
```

# Tabs

The Tabs component allows you to display text according to the button clicked.

To use it, just copy and paste the code below.

You can then modify the style by using / adding your own css class

```html
<nav-tabs class="nav-pills">
    <a href="#tab1" aria-selected="true">Tab 1</a>
    <a href="#tab2">Tab 2</a>
    <a href="#tab3">Tab 3</a>
</nav-tabs>
<div class="tabs-content">
    <div id="tab1">
        <p>Your text</p>
    </div>
    <div id="tab2" hidden="hidden">
        <p>Your text</p>
    </div>
    <div id="tab3" hidden="hidden">
        <p>Your text</p>
    </div>
</div>
```

# Textarea Auto Grow

The Textarea Auto Grow component allows a textarea to automatically resize itself according to the text.

To use it nothing more simple, in your textarea tag add as attribute `is="textarea-autogrow"`

```html
<textarea is="textarea-autogrow"></textarea>Proposez un Pull Request
```

Think about adding a hidden overflow to avoid displaying the scroll bar.

# Time Ago

To use the TimeAgo component and display a formatted date, you just have to add in your HTML page the `<time-ago></time-ago>` tag with 
a `data-ago` attribute in this attribute you have to give it a timestamp in second (The component will do the conversion itself) 

```html
<time-ago data-ago="1590487761"></time-ago>
```

# Contribute

- Fork this repository
- Make your change
- Submit a Pull Request

# License

See the license at the root of the project