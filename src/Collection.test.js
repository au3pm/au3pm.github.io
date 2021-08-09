import Collection from "./Collection";

describe("constructor", function () {
  it("no parameter", function () {
    expect(() => new Collection()).not.toThrowError(TypeError);
  });

  it("valid parameter", function () {
    expect(() => new Collection({})).not.toThrowError(TypeError);
  });

  it("invalid parameter", function () {
    expect(() => new Collection(1)).toThrowError(TypeError);
  });
});

describe("all", function () {
  it("empty collection", function () {
    let collection = new Collection();
    let actual = collection.all();
    expect(actual).toEqual({});
  });

  it("with items", function () {
    let collection = new Collection({ a: 1, b: "2", c: undefined, d: null });
    let actual = collection.all();
    expect(actual).toEqual({ a: 1, b: "2", c: undefined, d: null });
  });
});

describe("filter", function () {
  it("no parameter", function () {
    let collection = new Collection({ a: 1, b: 2, c: 0, d: "" });
    let actual = collection.filter();
    expect(actual.all()).toEqual({ a: 1, b: 2 });
  });

  it("callback respected", function () {
    let collection = new Collection({
      a: 0,
      b: 1,
      c: "",
      d: null,
      e: undefined
    });
    let actual = collection.filter((v) => true);
    expect(actual.all()).toEqual({ a: 0, b: 1, c: "", d: null, e: undefined });

    actual = collection.filter((v) => false);
    expect(actual.all()).toEqual({});
  });
});

describe("keys", function () {
  //TODO
});

describe("map", function () {
  it("requires one parameter", function () {
    let collection = new Collection();
    expect(() => collection.map()).toThrowError(TypeError);
  });

  it("nomal usage", function () {
    let collection = new Collection({ a: 0, b: false, c: undefined, d: null });
    let actual = collection.map((a) => a);
    expect(actual).toBeInstanceOf(Collection);
    expect(actual.all()).toEqual({ a: 0, b: false, c: undefined, d: null });
  });

  it("manipulation of values", function () {
    let collection = new Collection({ a: 0, b: 1, c: "2", d: "" });
    let actual = collection.map((a) => a + 1);
    expect(actual).toBeInstanceOf(Collection);
    expect(actual.all()).toEqual({ a: 1, b: 2, c: "21", d: "1" });
  });
});

describe("values", function () {
  //TODO
});
