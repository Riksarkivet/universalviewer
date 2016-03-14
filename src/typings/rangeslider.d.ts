interface JQuery {
    rangeslider(options: rangesliderOptions): any;
}

interface rangesliderOptions {
    polyfill?: boolean,
    onInit?: () => void,
    onSlide?: (position, value) => void,
    onSlideEnd?: (position, value) => void,
}