
| License | Source | --> | [Website](https://github.com/cadorn/runbash/blob/master/website.sh) | [npm](https://github.com/npm/npm) |
| :---: | --- | :---: | --- | --- |
| [FPL](https://opensource.org/licenses/FPL-1.0.0) | [github.com/cadorn/runbash](https://github.com/cadorn/runbash) | [![CircleCI](https://circleci.com/gh/cadorn/runbash.svg?style=svg)](https://circleci.com/gh/cadorn/runbash) | [cadorn.github.io/runbash](https://cadorn.github.io/runbash) | `runbash`

runbash
=======

Run [bash](https://www.gnu.org/software/bash/) and [bash.origin](https://github.com/bash-origin/bash.origin) from [NodeJS](https://nodejs.org/). Easily.

Usage
-----

```javascript
const RUNBASH = require("runbash");

RUNBASH([
    "echo 'Hello World'",       // Run a command
    "echo 'FOO: BAR'"           // Export a variable
], {
    verbose: false,             // Log internal activity
    progress: false,            // Log process output
    wrappers: {                 // Setup environment before commands
        "bash.origin": true     // Load bash.origin
    },
    wait: true,                 // Resolve when process ends
    exports: true,              // Scan for /^<NAME>: <VALUE>$/
}).then(function (result) {

    // result.code ~ 0          // Process exit code
    // result.stdout ~ []
    // result.stderr ~ []
    // result.exports[<NAME>] ~ <VALUE>

    return null;
}).catch(console.error);
```

Provenance
==========

Original Source Logic under [Free Public License](https://opensource.org/licenses/FPL-1.0.0) by [Christoph Dorn](http://christophdorn.com) since 2015.
