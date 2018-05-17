interface JQuery {
    rangeslider(options: rangesliderOptions): any;
}

interface rangesliderOptions {
    polyfill?: boolean,
    onInit?: () => void,
    onSlide?: (position: any, value: any) => void,
    onSlideEnd?: (position: any, value: any) => void,
}