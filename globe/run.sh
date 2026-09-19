#!/bin/sh
# Launch the Globe plugin demo app headlessly, then open http://localhost:22322/
#     EWC=/path/to/ewc ./run.sh
set -e

HERE=$(cd "$(dirname "$0")" && pwd)
EWC=${EWC:-$HOME/dev/ewc}

if [ ! -d "$EWC/EWC" ]; then
  echo "EWC not found at $EWC - set EWC=/path/to/ewc" >&2
  exit 1
fi

{
  cat <<APL
]link.create $EWC/EWC
]link.create GlobePlugin $HERE/APLSource
]link.create GlobeApp $HERE/app
#.EWC.FOLDER←'$EWC'
GlobeApp.Run
APL
  sleep 100000
} | dyalog +s -q
