---
title: ScopeStream
draft: true
summary: A browser-based oscilloscope frontend that streams captures off a bench scope over WebSockets, so you can look at waveforms without standing at the bench.
domain: software
status: active
role: Solo project
started: 2026-02-10
tech:
  - TypeScript
  - React
  - Node.js
  - WebSockets
  - VISA / SCPI
  - Canvas
  - Docker
highlights:
  - Renders 50k-point captures at 60 fps by decimating on the server and drawing to a single canvas rather than an SVG path per trace.
  - Replaced a screenshot-and-paste workflow that three people in the lab were doing by hand.
  - Runs as one Docker container against any SCPI-speaking scope.
links:
  - label: Repository
    href: https://github.com/yourhandle/scopestream
  - label: Live demo
    href: https://scopestream.example.com
featured: true
weight: 80
---

## The annoyance

Our bench scope lives in a room I do not. Checking whether a long-running test
was still behaving meant walking over, squinting, and photographing the screen.
The scope has an Ethernet port and speaks SCPI, so the data was right there —
it just had nowhere to go.

## How it works

A small Node service holds the VISA connection and polls the scope for
captures. Browsers connect over a WebSocket and receive decimated waveform
frames as binary payloads.

The decimation is the whole trick. A 50,000-point capture drawn naively is
50,000 line segments, most of which land on the same pixel column. ScopeStream
uses min/max decimation on the server: for each output pixel column it sends
only the minimum and maximum sample in that bucket, which preserves the visual
envelope — including narrow glitches — at roughly 1/20th the data.

```ts
/** Min/max decimation: two points per output column keeps transients visible
 *  that a naive "take every Nth sample" would walk straight past. */
function decimate(samples: Float32Array, columns: number): Float32Array {
  const out = new Float32Array(columns * 2);
  const bucket = samples.length / columns;

  for (let c = 0; c < columns; c++) {
    const start = Math.floor(c * bucket);
    const end = Math.floor((c + 1) * bucket);
    let min = Infinity;
    let max = -Infinity;

    for (let i = start; i < end; i++) {
      if (samples[i] < min) min = samples[i];
      if (samples[i] > max) max = samples[i];
    }
    out[c * 2] = min;
    out[c * 2 + 1] = max;
  }
  return out;
}
```

## Rendering

The first version drew each trace as an SVG `<path>` and managed maybe 8 fps.
Moving to a single `<canvas>` with a manual draw loop got it to a steady 60 fps,
because the browser is no longer maintaining a DOM node per trace or
recalculating layout on every frame.

## Current work

Adding a trigger history view, so you can scroll back through the last hundred
captures rather than only seeing the live one. The server already buffers them;
the UI for scrubbing through that buffer is the part I am still figuring out.
