
| License | Source | --> | [Website](https://github.com/cadorn/runbash/blob/master/website.sh) | [npm](https://github.com/npm/npm) |
| :---: | --- | :---: | --- | --- |
| [FPL](https://opensource.org/licenses/FPL-1.0.0) | [github.com/cadorn/runbash](https://github.com/cadorn/runbash) | [![CircleCI](https://circleci.com/gh/cadorn/runbash.svg?style=svg)](https://circleci.com/gh/cadorn/runbash) | [cadorn.github.io/runbash](https://cadorn.github.io/runbash) | `runbash`

runbash
=======

Run [bash](https://www.gnu.org/software/bash/) and [bash.origin](https://github.com/bash-origin/bash.origin) from [NodeJS](https://nodejs.org/). Easily. Promise.

Usage
-----

```javascript
const RUNBASH = require("runbash");

RUNBASH([
    "echo 'Hello World'",       // Run a command
    "echo 'FOO: BAR'"           // Export a variable
], {                            // Defaults
    verbose: false,             // Log internal activity
    progress: false,            // Log process output
    wrappers: {                 // Setup environment before commands
        "bash.origin": true     // Load bash.origin
    },
    wait: true,                 // Resolve when process ends
    exports: false,             // Scan for /^<NAME>: <VALUE>$/
}).then(function (result) {
    
    // result.code ~ 0          // Process exit code
    // result.stdout ~ []
    // result.stderr ~ []
    // result.exports[<NAME>] ~ <VALUE>

    return null;
}).catch(console.error);

RUNBASH([], {
    wait: false
}).then(function (result) {

    // result.process ~ <Process Object>
    // result.killDeep()        // Kill process and spawned child processes

    return null;
});
```

Provenance
==========

Original Source Logic under [Free Public License](https://opensource.org/licenses/FPL-1.0.0) by [Christoph Dorn](http://christophdorn.com) since 2015.
