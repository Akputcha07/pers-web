---
title: Envi-M
summary: A full-stack environmental monitoring system combining Arduino (C/C++) firmware with a Python data pipeline to score how conducive a space is for focused work.
domain: hybrid
tech:
  - Arduino
  - C/C++
  - Python
  - DHT11
  - Photoresistor
  - CSV
highlights:
  - Wrote embedded firmware to read temperature (DHT11), humidity, and light intensity (photoresistor) sensors and stream readings over Serial to a host machine.
  - Built a Python script to parse the serial stream, log readings to CSV with timestamps, and compute a custom "Focus Score" from threshold-based penalties (temp, humidity, light).
featured: true
weight: 10
---
