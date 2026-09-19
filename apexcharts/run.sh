#!/bin/sh
# Launch the ApexCharts plugin demo app headlessly, then open http://localhost:22322/
#     EWC=/path/to/ewc ./run.sh
set -e

HERE=$(cd "$(dirname "$0")" && pwd)
EWC=${EWC:-$HOME/dev/ewc}

if [ ! -d "$EWC/EWC" ]; then
  echo "EWC not found at $EWC - set EWC=/path/to/ewc" >&2
  exit 1
fi

if [ ! -f "$HERE/assets/ewc-apexcharts.js" ]; then
  echo "assets/ewc-apexcharts.js is missing - run: cd js && npm install && npm run build" >&2
  exit 1
fi

{
  cat <<APL
]link.create $EWC/EWC
]link.create ApexChartsPlugin $HERE/APLSource
]link.create ApexApp $HERE/app
#.EWC.FOLDER←'$EWC'
ApexApp.Run
APL
  sleep 100000
} | dyalog +s -q
