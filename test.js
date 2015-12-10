
const ASSERT = require("assert");
const RUNBASH = require("./");


RUNBASH([
    'echo $PWD'
]).then(function (result) {
    ASSERT.equal(result.stdout, process.cwd() + "\n");
    process.stdout.write("OK\n");
    process.exit(0);
}).catch(function (err) {
    console.error(err.stack);
    process.exit(1);
});
