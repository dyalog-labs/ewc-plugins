#!/bin/bash
# Container entrypoint, after ewc's ci/run-server.sh: pipe the APL setup into
# `dyalog +s -q`, then hold stdin open with `sleep infinity` so the event loop
# keeps cycling. Mirrors the env the image's default /entrypoint would set.
set -e

DYALOG="$(ls -d /opt/mdyalog/*/64/unicode 2>/dev/null | head -1)"
export DYALOG
export LD_LIBRARY_PATH="${DYALOG}:${LD_LIBRARY_PATH}"
export WSPATH="${DYALOG}/ws"
export TERM=dumb
export APL_TEXTINAPLCORE="${APL_TEXTINAPLCORE:-1}"
export TRACE_ON_ERROR=0
export SESSION_FILE="${SESSION_FILE:-$DYALOG/default.dse}"

(cat /work/plugins/gallery/docker/setup-gallery.apl; sleep infinity) | "${DYALOG}/dyalog" +s -q
