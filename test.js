const assert = require("assert");
const dot = require("./");


const sampleData = {
  tags: [
    { id: 1, tag: "tag1" },
    { id: 2, tag: "tag2" }
  ],
  nested: {
    deep: [
      {
        members: [
          { username: "tsuyoshiwada", profile: { age: 24 } },
          { username: "nestuser", profile: { age: 30 } },
          { username: "foobarbaz", profile: { age: 33 } }
        ]
      },
      {
        members: [
          { username: "testuser", profile: { age: 19 } },
          { username: "sample", profile: { age: 33 } },
          { username: "hogefuga", profile: { age: 40 } }
        ]
      }
    ]
  }
};


describe("dotFinder()", () => {
  it("Should be return value", () => {
    assert(dot() == null);
    assert(dot(null) == null);
    assert(dot(undefined) == null);
    assert(dot([]) == null);
    assert(dot({}) == null);
    assert(dot(0) == null);
    assert(dot("") == null);

    const t1 = { foo: { bar: "baz" } };
    assert(dot(t1, null) == null);
    assert(dot(t1, undefined) == null);
    assert(dot(t1, "") == null);
    assert(dot(t1, "bar") == null);
    assert(dot(t1, "fuga") == null);
    assert.deepStrictEqual(dot(t1, "foo"), { bar: "baz" });
    assert.deepStrictEqual(dot(t1, "['foo']"), { bar: "baz" });
    assert(dot(t1, "foo.bar") === "baz");
    assert(dot(t1, "['foo']['bar']") === "baz");
    assert(dot(t1, "test", "default") === "default");
    assert(dot(t1, "['test']", "default") === "default");
    assert(dot(t1, "foo.bar", "default") === "baz");
    assert(dot(t1, "['foo'].bar", "default") === "baz");
    assert(dot(t1, "['foo']['bar']", "default") === "baz");

    const t2 = { "foo.bar": { baz: { fuga: "fuge" } } };
    assert.deepStrictEqual(dot(t2, "foo\\.bar"), { baz: { fuga: "fuge" } });
    assert.deepStrictEqual(dot(t2, "foo\\.bar.baz"), { fuga: "fuge" });
    assert.deepStrictEqual(dot(t2, "foo\\.bar.baz.fuga"), "fuge");
    assert(dot(t2, "foo\\.bar.baz.fuga.fuge") == null);

    const t3 = [null, [{ nested: { deep: { fuga: "fuge" } } }], false];
    assert(dot(t3, "[0]", "def") == null);
    assert(dot(t3, "0", "def") == null);
    assert(dot(t3, "[2]") === false);
    assert(dot(t3, "2") === false);
    assert.deepStrictEqual(dot(t3, "[1][0]"), { nested: { deep: { fuga: "fuge" } } });
    assert.deepStrictEqual(dot(t3, "1.0"), { nested: { deep: { fuga: "fuge" } } });
    assert.deepStrictEqual(dot(t3, "[1][0].nested"), { deep: { fuga: "fuge" } });
    assert.deepStrictEqual(dot(t3, "[1][0]['nested']"), { deep: { fuga: "fuge" } });
    assert.deepStrictEqual(dot(t3, "[1][0].nested.deep"), { fuga: "fuge" });
    assert.deepStrictEqual(dot(t3, "[1][0].nested['deep']"), { fuga: "fuge" });
    assert.deepStrictEqual(dot(t3, "[1][0].nested.deep.fuga"), "fuge");
    assert.deepStrictEqual(dot(t3, "[1][0].nested['deep']['fuga']"), "fuge");

    const t4 = [
      { k: "v1" },
      { k: "v2" },
      { k: "v3" }
    ];

    assert.deepStrictEqual(dot(t4, "*.k"), ["v1", "v2", "v3"]);
    assert(dot(t4, "*.k.foo") == null);

    // Real world
    assert.deepStrictEqual(dot(sampleData, "tags.*"), [
      { id: 1, tag: "tag1" },
      { id: 2, tag: "tag2" }
    ]);

    assert.deepStrictEqual(dot(sampleData, "tags.*.id"), [1, 2]);
    assert(dot(sampleData, "tags.*.id.test") == null);

    assert.deepStrictEqual(dot(sampleData, "nested.deep.*.members.*.profile.age"), [
      24, 30, 33,
      19, 33, 40
    ]);

    assert.deepStrictEqual(dot(sampleData, "nested.deep.1.members.*.username"), [
      "testuser",
      "sample",
      "hogefuga"
    ]);
  });
});
