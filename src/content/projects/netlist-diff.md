---
title: netlist-diff
draft: true
summary: A command-line tool that diffs two KiCad netlists by connectivity rather than by text, so schematic reviews stop being a game of spot-the-difference.
domain: software
status: shipped
role: Solo project
started: 2025-06-01
ended: 2025-11-30
tech:
  - Rust
  - clap
  - KiCad
  - CI/CD
highlights:
  - Turns a 4,000-line unreadable text diff into a summary of the handful of nets that actually changed.
  - Runs in CI on every hardware pull request, failing the build when a net changes without a note in the commit message.
  - Picked up by two other teams in the department.
links:
  - label: Repository
    href: https://github.com/yourhandle/netlist-diff
featured: false
weight: 60
---

## The problem

KiCad netlists are S-expressions with unstable ordering. Move one component in
the schematic and `git diff` shows hundreds of changed lines, almost none of
which represent an electrical change. Reviewers learned to skim them, which
defeats the point of reviewing them at all.

## The approach

Parse both netlists into a graph of nets and pins, canonicalise it, then diff
the graphs. The output describes what changed electrically:

```text
$ netlist-diff main.net feature.net

  ~ /VBUS_5V          6 pins -> 7 pins
      + U4.VDD
  ~ /SPI_MISO         3 pins -> 3 pins
      - U2.PA6
      + U2.PA11
  + /THERM_SENSE      2 pins  (new net)
  - /TP_SPARE_1       1 pin   (removed)

  4 nets changed, 128 unchanged
```

Ordering, whitespace, and component reference renumbering all get normalised
away before comparison, so the only things that survive into the output are
genuine connectivity changes.

## In CI

The interesting use turned out to be the exit code. In our hardware repos, a
pull request that changes connectivity fails the build unless the commit
message explains the change. It is a small thing, but it moved the review
conversation from "did anything change?" to "is this change right?".

```yaml
- name: Check netlist changes
  run: netlist-diff --base origin/main --fail-on-change --require-rationale
```

## Where it stopped

It does exactly what I needed and I stopped adding to it deliberately. The
obvious next feature — diffing PCB layout rather than just the netlist — is a
genuinely much harder problem and not one I needed solved.
