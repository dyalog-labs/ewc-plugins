#!/bin/sh
# Launch the MUI plugin demo app headlessly, then open http://localhost:22322/
#     ./run.sh              # expects EWC at ~/dev/ewc
#     EWC=/path/to/ewc ./run.sh
set -e

HERE=$(cd "$(dirname "$0")" && pwd)
EWC=${EWC:-$HOME/dev/ewc}

if [ ! -d "$EWC/EWC" ]; then
  echo "EWC not found at $EWC - set EWC=/path/to/ewc" >&2
  exit 1
fi

if [ ! -f "$HERE/assets/ewc-mui.js" ]; then
  echo "assets/ewc-mui.js is missing - run: cd js && npm install && npm run build" >&2
  exit 1
fi

{
  cat <<APL
]link.create $EWC/EWC
]link.create MuiPlugin $HERE/APLSource
]link.create MuiApp $HERE/app
#.EWC.FOLDER←'$EWC'
MuiApp.Start 'Browser'
APL
  sleep 100000
} | dyalog +s -q
