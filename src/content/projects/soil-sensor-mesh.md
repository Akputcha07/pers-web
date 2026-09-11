---
title: Soil Moisture Sensor Mesh
draft: true
summary: A battery-powered mesh of capacitive soil sensors for a community garden, running eighteen months on a single pair of AA cells.
domain: hybrid
status: prototype
role: Solo project
started: 2024-05-01
ended: 2025-02-01
tech:
  - ESP32-C3
  - ESP-NOW
  - C
  - KiCad
  - MQTT
  - Grafana
highlights:
  - Got average draw down to 41 µA, giving roughly eighteen months on 2x AA.
  - Twelve nodes ran through a full growing season with no manual intervention.
  - Capacitive sensing avoided the electrode corrosion that killed the resistive probes we started with.
links:
  - label: Repository
    href: https://github.com/yourhandle/soil-mesh
featured: false
weight: 40
---

## Context

The community garden I volunteer at was watering on a fixed schedule, which is
a reasonable default and a poor one in practice — the beds nearest the fence
dry out twice as fast as the ones in the middle. I wanted actual numbers per
bed.

## Why capacitive

We started with cheap resistive probes. They work for about six weeks, then the
electrodes corrode away, because you are running DC through wet soil and
electroplating your sensor into oblivion.

Capacitive sensing puts the electrodes behind solder mask, so nothing metal
touches the soil. The trade-off is a fussier readout: you are measuring a
change of a few picofarads against a baseline that drifts with temperature. A
per-node calibration at install time, plus a temperature correction from the
onboard sensor, got repeatability inside ±3% volumetric water content.

## Power budget

Eighteen months on two AA cells means an average draw of around 40 µA, which
shapes every decision:

- The node is in deep sleep 99.94% of the time, waking once every fifteen
  minutes.
- A wake cycle is about 340 ms: settle the sensor, take sixteen readings,
  median-filter them, transmit, sleep.
- Radio is ESP-NOW rather than Wi-Fi. Skipping association saves roughly two
  seconds of radio-on time per wake, which dominates everything else.
- The sensor is powered from a GPIO rather than the rail, so it draws nothing
  while asleep.

```c
/* Wake, measure, transmit, sleep. Nothing here is allowed to block
   indefinitely: a sensor that hangs awake is a sensor with a dead battery. */
void app_main(void) {
    gpio_set_level(SENSOR_PWR, 1);
    vTaskDelay(pdMS_TO_TICKS(SETTLE_MS));

    reading_t reading = median_of_16(read_capacitance);
    gpio_set_level(SENSOR_PWR, 0);

    espnow_send_with_timeout(&reading, TX_TIMEOUT_MS);
    esp_deep_sleep(WAKE_INTERVAL_US);
}
```

## Status

Twelve nodes ran a full season and the data changed the watering schedule,
which was the point. I am calling it a prototype rather than finished because
the enclosure is a 3D print with a gasket I do not fully trust, and two nodes
took on water over winter.
