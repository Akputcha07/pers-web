---
title: Rev B board bring-up, and a trigger history view
draft: true
date: 2026-09-08
summary: Bringing up the rev B flight computer with a fixed antenna layout, and building the capture-scrubbing UI that ScopeStream has needed since day one.
focus:
  - Flight computer rev B
  - ScopeStream trigger history
  - Reading about SerDes
projects:
  - telemetry-flight-computer
  - scopestream
---

## Flight computer rev B

Boards arrived Tuesday. The changes from rev A are all about the RF path: the
switching regulator moved to the opposite corner, there is a ground pour cutout
under the antenna, and the feedline is now a proper coplanar waveguide rather
than whatever rev A was doing.

First power-up was uneventful, which is the best outcome. Link budget testing
is this weekend — I want to see the 8 dB that the simulation says the layout
change should buy back.

Still outstanding:

- Dead time on the boost stage needs retuning; the rev A values are slightly
  conservative for the new gate driver.
- The SD card detect line is floating. My fault, not the fab's.

## ScopeStream

Working on the trigger history view. The server has always buffered the last
hundred captures; there has just never been a way to look at them. The
interaction I am aiming for is a filmstrip you can scrub, with the live capture
pinned at the right edge.

The hard part is not the rendering, it is deciding what happens when you scrub
backwards while new captures are still arriving. Right now scrubbing pauses the
live view, which feels wrong — you lose the thing you were watching. I think
the answer is to keep the live trace visible as a ghost behind the historical
one.

## Reading

Working through a SerDes textbook, mostly to stop treating high-speed links as
a black box. I am at the point of understanding why equalisation is necessary
and not yet at the point of being able to design any.
