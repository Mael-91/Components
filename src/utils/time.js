export default class DOMTimer {
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