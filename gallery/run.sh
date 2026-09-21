#!/bin/sh
# Launch the plugin gallery headlessly, then open http://localhost:22322/
#     EWC=/path/to/ewc ./run.sh
set -e

HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/.." && pwd)
EWC=${EWC:-$HOME/dev/ewc}

if [ ! -d "$EWC/EWC" ]; then
  echo "EWC not found at $EWC - set EWC=/path/to/ewc" >&2
  exit 1
fi

if [ ! -f "$ROOT/kendo/assets/ewc-kendo.js" ]; then
  echo "kendo/assets/ewc-kendo.js is missing - run: cd kendo/js && npm install && npm run build" >&2
  echo "(the Kendo tab will be empty without it)" >&2
fi

{
  cat <<APL
]link.create $EWC/EWC
]link.create FireworksPlugin $ROOT/fireworks/APLSource
]link.create FireworksApp $ROOT/fireworks/app
]link.create GlobePlugin $ROOT/globe/APLSource
]link.create GlobeApp $ROOT/globe/app
]link.create ApexChartsPlugin $ROOT/apexcharts/APLSource
]link.create ApexApp $ROOT/apexcharts/app
]link.create KendoPlugin $ROOT/kendo/APLSource
]link.create KendoApp $ROOT/kendo/app
]link.create Gallery $HERE/app
#.EWC.FOLDER←'$EWC'
Gallery.Run
APL
  sleep 100000
} | dyalog +s -q
