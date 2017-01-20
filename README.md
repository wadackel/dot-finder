dot-finder
==========

[![Build Status](http://img.shields.io/travis/tsuyoshiwada/dot-finder.svg?style=flat-square)](https://travis-ci.org/tsuyoshiwada/dot-finder)
[![npm version](https://img.shields.io/npm/v/dot-finder.svg?style=flat-square)](http://badge.fury.io/js/dot-finder)

> dot-finder is using powerful dot notation to get values in JSON object



## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)



## Install

```bash
$ npm install dot-finder
```



## Usage

```javascript
const dot = require("dot-finder");


/**
 * Object
 */

dot({ foo: { bar: "baz" } }, "foo.bar");
// or
dot({ foo: { bar: "baz" } }, "foo['bar']");
// => "baz"

dot({ "foo.bar": { baz: "hoge" } }, "foo\\.bar.baz");
// => "hoge"

dot({}, "notfound", "defaultValue");
// => "defaultValue"


/**
 * Array
 */

dot([[{ fruits: "apple" }, { fruits: "pineapple" }]], "[0][1].fruits");
// or
dot([[{ fruits: "apple" }, { fruits: "pineapple" }]], "0.1.fruits");
// => "pineapple"


/**
 * Advanced
 */

const data1 = {
  authors: [
    { username: "tsuyoshiwada", profile: { age: 24 } },
    { username: "sampleuser", profile: { age: 30 } },
    { username: "foobarbaz", profile: { age: 33 } }
  ]
};

dot(data1, "authors.*.username");
// => ["tsuyoshiwada", "sampleuser", "foobarbaz"]

dot(data1, "authors.*.profile.age");
// => [24, 30, 33]


const data2 = [
  {
    posts: {
      tags: [
        { id: 1, slug: "news" },
        { id: 2, slug: "sports" },
        { id: 3, slug: "entertaiment" }
      ]
    }
  },
  {
    posts: {
      tags: [
        { id: 4, slug: "music" },
        { id: 5, slug: "it" },
        { id: 6, slug: "programming" }
      ]
    }
  }
];

dot(data2, "*.posts.tags.*.slug");
// => ["news", "sports", "entertaiment", "music", "it", "programming"]
```



## Contribute

1. Fork it!
2. Create your feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -am 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request :D



## License

[MIT © tsuyoshiwada](./LICENSE)
