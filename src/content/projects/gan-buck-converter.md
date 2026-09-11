---
title: 48 V to 12 V GaN Buck Converter
draft: true
summary: A 300 W synchronous buck converter built to compare GaN and silicon switching loss across a realistic load profile, with an automated measurement rig behind it.
domain: hardware
status: shipped
role: Designer and experimenter
org: University Power Electronics Lab
started: 2025-01-15
ended: 2025-08-20
tech:
  - LTspice
  - Altium Designer
  - GaN FETs
  - MATLAB
  - Python
  - Thermal imaging
highlights:
  - Measured 96.4% peak efficiency, 2.1 points above the silicon reference design at the same switching frequency.
  - Automated a characterisation sweep that previously took a full day of manual bench work down to 25 minutes.
  - Wrote up the dataset as the lab's reference for GaN device selection.
links:
  - label: Write-up (PDF)
    href: https://github.com/yourhandle/gan-buck/blob/main/report.pdf
  - label: Design files
    href: https://github.com/yourhandle/gan-buck
featured: true
weight: 90
---

## Why bother

GaN datasheets promise lower switching loss than silicon, but the figures are
quoted under idealised conditions. The lab wanted numbers from a board we
actually built, across the load profile our projects really see, so that device
selection stopped being a matter of vendor marketing.

## The design

A synchronous buck: 48 V in, 12 V out, 25 A continuous, running at 500 kHz.
The interesting constraints were all in the layout.

| Parameter | Target | Measured |
| --- | --- | --- |
| Peak efficiency | > 95% | 96.4% |
| Output ripple | < 120 mV | 84 mV |
| Load step recovery | < 50 µs | 38 µs |
| Case temperature at 25 A | < 85 °C | 71 °C |

GaN switches fast enough that the high-frequency loop inductance dominates
everything. Keeping the power loop under about 5 nH meant putting the input
capacitors directly beside the half-bridge on the same layer, with the return
path on the layer immediately below. An earlier revision with the caps 8 mm
further out rang badly enough to exceed the gate drive's absolute maximum on
every switching edge.

## The measurement rig

The comparison only meant anything if both boards were measured identically,
which ruled out doing it by hand. I wrote a Python harness that drives the
electronic load and power supply over SCPI, pulls waveforms off the scope, and
writes everything to a tidy dataset.

```python
def sweep(load, supply, scope, currents, freqs):
    """Walk the operating grid, letting each point settle thermally first."""
    for freq in freqs:
        supply.set_switching_frequency(freq)
        for current in currents:
            load.set_current(current)
            wait_for_thermal_steady_state(scope, tolerance_c=0.5)
            yield measure_point(scope, freq=freq, current=current)
```

The thermal settling step is the part that matters. My first sweeps stepped
straight from point to point and produced efficiency curves that sloped with
measurement order rather than with load — the board was simply still warming up.

## Outcome

The GaN design won, but by less than the datasheets suggested: 2.1 points at
peak rather than the 4 or so implied by switching-loss figures alone. Gate
drive loss and the body diode conduction interval during dead time ate the
difference. That number is now what the lab plans around.
