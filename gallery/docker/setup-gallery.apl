⍝ APL commands fed to `dyalog +s -q` by docker/start.sh to bring up the
⍝ plugin gallery. Mount layout comes from gallery/Dockerfile:
⍝   /work/ewc      → the EWC release: server, demos, built client
⍝   /work/plugins  → this repository, bundles built in

]link.create /work/ewc/EWC
]link.create FireworksPlugin /work/plugins/fireworks/APLSource
]link.create FireworksApp /work/plugins/fireworks/app
]link.create GlobePlugin /work/plugins/globe/APLSource
]link.create GlobeApp /work/plugins/globe/app
]link.create ApexChartsPlugin /work/plugins/apexcharts/APLSource
]link.create ApexApp /work/plugins/apexcharts/app
]link.create KendoPlugin /work/plugins/kendo/APLSource
]link.create KendoApp /work/plugins/kendo/app
]link.create Gallery /work/plugins/gallery/app
EWC.FOLDER←'/work/ewc'
Gallery.Start 'Multi'
