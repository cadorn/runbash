
**Source:** [github.com/cadorn/runbash](https://github.com/cadorn/runbash) |
**Website:** [cadorn.github.io/runbash](https://cadorn.github.io/runbash) |
**Continuous Integration:** [![CircleCI](https://circleci.com/gh/cadorn/runbash.svg?style=svg)](https://circleci.com/gh/cadorn/runbash)

runbash
=======

Run [bash](https://www.gnu.org/software/bash/) and [bash.origin](https://github.com/bash-origin/bash.origin) from [NodeJS](https://nodejs.org/). Easily.

Install
-------

```bash
npm install runbash
```

Usage
-----

```javascript
const RUNBASH = require("runbash");

RUNBASH([
    "echo 'Hello World'",
    "echo 'FOO: BAR'"
], {
    verbose: false,
    progress: false,
    wrappers: {
        "bash.origin": true
    },
    wait: true,
    exports: true,    
}).then(function (result) {

    // result.code
    // result.stdout
    // result.status
    // result.exports.FOO

    return null;
});
```

Provenance
==========

Original source logic under [Free Public License](https://opensource.org/licenses/FPL-1.0.0) by [Christoph Dorn](http://christophdorn.com)
