---
title: Learning Rust properly, and failing at RF
draft: true
date: 2026-03-12
summary: Rewriting netlist-diff taught me more about Rust than any tutorial did, and my first RF board taught me that simulation is not measurement.
focus:
  - Rust
  - RF layout
  - netlist-diff
projects:
  - netlist-diff
---

Two things this quarter.

## Rust, by rewriting something real

I had done the tutorials and understood nothing. Rewriting `netlist-diff` from
a Python script into Rust is what actually taught me — specifically the part
where the borrow checker refused to let me hold a reference into the netlist
graph while mutating it, and I had to stop and think about what I was actually
asking for.

The resulting design is better than the Python one, and not because Rust is
faster. It is better because the types made me separate parsing from
canonicalisation from diffing, which I had smeared together before.

## RF, badly

My first deliberately-RF board does not work well, and the gap between what
LTspice told me and what the network analyser told me is educational. The
simulation had a clean match across the band. The real board has a return loss
that falls apart above 800 MHz.

The likely culprits, in order of my confidence:

1. The connector footprint has a ground pad geometry I copied without thinking
   about the discontinuity it creates.
2. My board stackup assumptions were guesses. I assumed 1.6 mm FR4 with
   standard layer spacing; the fab's actual stackup is different enough to
   shift the trace impedance several ohms.
3. Simulation did not include the connector at all.

Item three is the real lesson. I simulated the part of the system I knew how to
simulate and quietly assumed the rest was ideal.
