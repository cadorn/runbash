#!/usr/bin/env bash.origin.script

depend {
    "pages": "@com.github/pinf-to/to.pinf.com.github.pages#s1"
}

CALL_pages publish {
    "css": (css () >>>
        BODY {
            padding-left: 20px;
        }
    <<<),
    "anchors": {
        "body": "$__DIRNAME__/README.md"
    }
}
