#!/bin/sh
# Launch the Kendo plugin demo app headlessly, then open http://localhost:22322/
#     ./run.sh              # expects EWC at ~/dev/ewc
#     EWC=/path/to/ewc ./run.sh
set -e

HERE=$(cd "$(dirname "$0")" && pwd)
EWC=${EWC:-$HOME/dev/ewc}

if [ ! -d "$EWC/EWC" ]; then
  echo "EWC not found at $EWC - set EWC=/path/to/ewc" >&2
  exit 1
fi

if [ ! -f "$HERE/assets/ewc-kendo.js" ]; then
  echo "assets/ewc-kendo.js is missing - run: cd js && npm install && npm run build" >&2
  exit 1
fi

{
  cat <<APL
]link.create $EWC/EWC
]link.create KendoPlugin $HERE/APLSource
]link.create KendoApp $HERE/app
#.EWC.FOLDER←'$EWC'
KendoApp.Run
APL
  sleep 100000
} | dyalog +s -q
