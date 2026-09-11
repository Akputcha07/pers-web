---
title: Telemetry Flight Computer
draft: true
summary: A custom avionics board for a high-power rocket, logging nine sensor channels at 500 Hz and downlinking live telemetry over LoRa.
domain: hybrid
status: active
role: Hardware and firmware lead
org: University Rocketry Team
started: 2025-09-01
tech:
  - STM32F411
  - C
  - FreeRTOS
  - KiCad
  - LoRa / SX1276
  - SPI
  - Python
highlights:
  - Cut end-to-end telemetry latency from 1.2 s to 180 ms by replacing polled UART reads with a DMA ring buffer.
  - Survived three flights to 4,200 ft with zero data loss, including one hard landing that cracked the airframe.
  - Board cost came in at $38 per unit against a $150 commercial equivalent.
links:
  - label: Repository
    href: https://github.com/yourhandle/flight-computer
  - label: Schematics
    href: https://github.com/yourhandle/flight-computer/tree/main/hardware
featured: true
weight: 100
---

## The problem

Our team had been flying an off-the-shelf altimeter that logged apogee and
little else. Post-flight analysis meant guessing: we could see how high the
rocket went, but not how the airframe behaved on the way there. We wanted
continuous inertial data, and we wanted to see it on the ground while the
rocket was still in the air.

## What I built

A four-layer board built around an STM32F411 running FreeRTOS, with three
concurrent tasks:

- **Acquisition** samples a 9-DoF IMU, a barometer, and a thermistor over SPI,
  timestamping each frame against a hardware timer.
- **Logging** writes frames to an SD card in fixed-size blocks, so a power loss
  costs at most one block rather than the whole flight.
- **Downlink** packs a decimated subset of frames into LoRa packets at 5 Hz.

```c
/* The acquisition task never touches the SD card directly. It publishes into
   a lock-free ring buffer that the logging task drains, so a slow SD write
   can never stall sampling. */
static void acquisition_task(void *arg) {
    TickType_t next = xTaskGetTickCount();
    for (;;) {
        frame_t frame = {
            .t_us  = timer_now_us(),
            .imu   = imu_read(),
            .baro  = baro_read(),
        };
        ring_push(&telemetry_ring, &frame);
        vTaskDelayUntil(&next, pdMS_TO_TICKS(2));  /* 500 Hz */
    }
}
```

## Getting to 500 Hz

The first revision topped out around 90 Hz and dropped frames under load. Two
changes fixed it:

1. **DMA everywhere.** The original driver did blocking SPI reads inside the
   sample loop. Moving the IMU burst read to DMA freed roughly 60% of the CPU
   budget.
2. **Decoupling the SD card.** SD write latency is wildly variable — usually
   under a millisecond, occasionally 90 ms when the card does internal wear
   levelling. The ring buffer absorbs those stalls.

## What I would do differently

The rev A board routed the LoRa antenna feedline past the switching regulator,
and we paid for it with a noticeably worse link budget. Rev B moved the
regulator to the opposite corner and added a ground pour cutout under the
antenna, which bought back about 8 dB.

I would also have brought out a proper debug header instead of test pads.
Three flights in, I had soldered and desoldered the same four wires often
enough to lift a pad.
