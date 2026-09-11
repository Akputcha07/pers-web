---
title: Halfway through the summer, and thinking about test automation
draft: true
date: 2026-06-24
summary: Six weeks into the internship at Example Instruments, where the most valuable thing I have built is not a board but the rig that tests them.
focus:
  - Sensor interface board
  - Bench test automation
  - DFM reviews
projects:
  - telemetry-flight-computer
---

Six weeks in. The project I was given is a sensor interface board, and the
schematic and layout went about as expected. The surprise has been how much of
my actual time goes into testing rather than designing.

## The rig

Validating each board by hand took about twenty minutes: apply power, check
rails with a meter, load firmware, run four functional checks, write the
results in a spreadsheet. Twenty minutes times a build of sixty boards is
twenty hours of someone's week, and the results depend on who did it.

So I built a pogo-pin fixture and a Python script that does all of it in under
three minutes and writes a signed JSON record per board. It is not clever
software. It is a state machine driving a power supply, a DMM, and a
programmer over USB. But it turned a tedious, error-prone afternoon into
something you start and walk away from.

The lesson I did not expect: **the test rig is the deliverable that outlasts
the board**. The board will be revised. The fixture and the script will get
reused for the next four projects.

## DFM

Sitting in on design-for-manufacturing reviews has been the other education.
Things I now think about that I did not in March:

- Panelisation and how it constrains where you can put connectors.
- Why your assembler cares about which side your tall components are on.
- That a 0402 is cheaper than an 0603 in volume and more expensive to rework
  by hand, and which of those matters depends on your build size.
