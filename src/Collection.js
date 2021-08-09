export default class Collection {
  static objectConstructor = {}.constructor;

  items = {};

  constructor(items) {
    if (items === undefined) {
      return;
    }
    if (items.constructor !== this.constructor.objectConstructor) {
      throw new TypeError(
        "argument 0 is not an simple object in Collection.constructor"
      );
    }
    this.items = items;
  }

  all() {
    return this.items;
  }

  filter(callback) {
    if (!callback) {
      callback = (v) => v;
    }

    const results = {};

    this.keys().forEach((key) => {
      let result = callback.call(null, this.items[key], key, this.items);
      if (result) {
        results[key] = this.items[key];
      }
    });

    return new this.constructor(results);
  }

  keys() {
    return Object.keys(this.items);
  }

  map(callback) {
    if (!callback) {
      throw new TypeError(
        "missing argument 0 when calling function Collection.map"
      );
    }

    const result = {};

    this.keys().forEach(
      (key) => (result[key] = callback.call(null, this.items[key], key, this))
    );

    return new this.constructor(result);
  }

  values() {
    return this.keys().map((key) => this.items[key]);
  }
}
