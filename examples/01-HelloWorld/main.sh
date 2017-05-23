#!/usr/bin/env bash.origin.script

BO_run_recent_node --eval '
    const ASSERT = require("assert");
    const RUNBASH = require("../..");

    RUNBASH([
        "echo $PWD"
    ]).then(function (result) {

        ASSERT.equal(result.stdout, process.cwd() + "\n");

        console.log("result", JSON.stringify(result, null, 4));

        process.stdout.write("OK\n");
        process.exit(0);

    }).catch(function (err) {

        console.error(err.stack);
        process.exit(1);
    });
'

echo "OK"
