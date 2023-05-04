export class ScrollObserver {
  constructor(elements, callback, options) {
    this.elements = document.querySelectorAll(elements);
    const defaultOptions = {
      root: null, //ビューポートをルート要素にする
      // rootMargin: "-100px 0px",
      rootMargin: "-200px 0px",
      // rootMargin: isPC ? "-250px 0px" : "-100px 0px",
      once: true,
    }
    this.callback = callback;
    this.options = Object.assign(defaultOptions, options); // オブションをマージ
    this.once = this.options.once;

    this._init();
  }

  _init() {
    const callback = function (entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.callback(entry.target, true);
          if(this.once) {
            observer.unobserve(entry.target);
          }
        } else {
          this.callback(entry.target, false);
        }
      });
    };

    this.observer = new IntersectionObserver(callback.bind(this), this.options);

    this.elements.forEach(element => this.observer.observe(element));
  }
}