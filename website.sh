#!/usr/bin/env bash.origin.script

depend {
    "pages": "@com.github/pinf-to/to.pinf.com.github.pages#s1"
}

CALL_pages publish {
    "anchors": {
        "body": "$__DIRNAME__/README.md"
    },    
    "css": (css () >>>
        BODY {
            width: 80%;
            margin-left: 10%;
            padding: 0px;
            padding-top: 30px;
            padding-bottom: 30px;
        }

        BODY > P {
            margin-left: 10px;
            margin-right: 10px;
        }

        A {
            color: #0000ff;
            text-decoration: none;
            border-bottom: 1px dashed;
        }

        A:visited {
            color: #aa5e13;
            border-bottom: 1px solid #ffffff;
        }

        H1 {
            border-bottom: 3px solid #1f75af;
            padding-bottom: 10px;
            padding-left: 10px;
        }

        H2 {
            border-bottom: 2px solid rgba(31,117,175,0.6);
            padding-bottom: 5px;
            padding-left: 10px;
        }

        H3 {
            border-bottom: 1px solid rgba(32,117,175,0.4);
            padding-left: 10px;
        }

        PRE {
            background-color: #fcfcfc;    
            border: 1px solid #dcdcdc;
            padding: 10px;
            margin-left: 10px;
            margin-right: 10px;
        }

        CODE {
            font: 12px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        }

        TABLE {
            WIDTH: 100%;
            margin-left: 10px;
            margin-right: 10px;
        }
    <<<)
}
