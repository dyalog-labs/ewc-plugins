# The plugin gallery as a self-contained container.
#
# Build from the repository root (the context must include every plugin):
#     docker build -t ewc-gallery -f gallery/Dockerfile .
#     docker run -p 22322:22322 ewc-gallery
# then open http://localhost:22322/
#
# Dyalog APL is free for non-commercial use but is not free software - see
# the licence in the dyalog/dyalog base image.

# ── The bundles that are never committed (they compile third-party code) ──
FROM node:22-slim AS bundles
WORKDIR /build
COPY apexcharts/js apexcharts/js
RUN cd apexcharts/js && npm install && npm run build
COPY kendo/js kendo/js
RUN cd kendo/js && npm install && npm run build
# vite writes each bundle to ../assets: /build/{apexcharts,kendo}/assets

# ── EWC itself, from the release: server, demos and built client in one tree ──
FROM debian:stable-slim AS ewc
# bsdtar rather than unzip: the EWC tree has ⎕IO.apla/⎕ML.apla files, whose
# non-ASCII names unzip mangles to #U2395IO.apla
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl libarchive-tools ca-certificates \
 && rm -rf /var/lib/apt/lists/*
ARG EWC_VERSION=v0.6.0
RUN curl -fsSL -o /tmp/ewc.zip \
      "https://github.com/Dyalog/ewc/releases/download/${EWC_VERSION}/ewc-${EWC_VERSION}.zip" \
 && mkdir /ewc && LANG=C.UTF-8 LC_ALL=C.UTF-8 bsdtar -xf /tmp/ewc.zip -C /ewc

# ── Runtime ──
FROM dyalog/dyalog:latest
COPY --from=ewc /ewc /work/ewc
COPY fireworks /work/plugins/fireworks
COPY globe /work/plugins/globe
COPY apexcharts /work/plugins/apexcharts
COPY kendo /work/plugins/kendo
COPY gallery /work/plugins/gallery
COPY --from=bundles /build/apexcharts/assets /work/plugins/apexcharts/assets
COPY --from=bundles /build/kendo/assets /work/plugins/kendo/assets

EXPOSE 22322
ENTRYPOINT ["/work/plugins/gallery/docker/start.sh"]
