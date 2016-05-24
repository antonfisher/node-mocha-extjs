#!/usr/bin/env bash

DEMO_DEST="../antonfisher.github.io/demo/mocha-extjs";

cd test/sandbox/ \
    && sencha app build \
    && cd - \
    && mkdir -p ./"${DEMO_DEST}" \
    && rm -rf ./"${DEMO_DEST}"/* \
    && cp -r ./test/sandbox/build/production/Sandbox/* ./"${DEMO_DEST}"/ \
    && mkdir -p ./"${DEMO_DEST}"/test/ \
    && cp -r test/suites/ ./"${DEMO_DEST}"/test;
exit_code="${?}";

if [[ "${exit_code}" == 0 ]]; then
    cd ./"${DEMO_DEST}";
    python -m SimpleHTTPServer 3333;
fi;

exit "${exit_code}";
