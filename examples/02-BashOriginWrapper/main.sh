#!/usr/bin/env bash.origin.script

BO_run_recent_node --eval '
    const ASSERT = require("assert");
    const RUNBASH = require("../..");

    RUNBASH([
        "echo $PWD",
        "BO_log 1 \"Hello World\""
    ], {
        wrappers: {
            "bash.origin": true
        }
    }).then(function (result) {

        result.stdout = result.stdout.toString();
        result.stderr = result.stderr.toString();

        ASSERT.equal(result.stdout, process.cwd() + "\n");
        ASSERT.equal(result.stderr, "Hello World\n");

        console.log("result", JSON.stringify(result, null, 4));

        process.stdout.write("OK\n");
        process.exit(0);

    }).catch(function (err) {

        console.error(err.stack);
        process.exit(1);
    });
'

echo "OK"
