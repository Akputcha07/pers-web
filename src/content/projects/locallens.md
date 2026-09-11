---
title: LocalLens
summary: A local-first document search engine in C++20/Qt 6 that indexes and full-text searches folders offline, using BM25 ranking for relevance and returning results in microseconds.
domain: software
tech:
  - C++20
  - Qt 6
  - BM25
  - Win32 API
highlights:
  - Designed a multi-threaded architecture (UI, filesystem watcher, and indexer worker threads) using Qt's queued signal/slot system and a mutex/condition-variable task queue to keep the UI responsive under continuous background indexing.
  - Implemented a native filesystem watcher using Win32's ReadDirectoryChangesW for real-time re-indexing without polling, plus a portable QFileSystemWatcher fallback.
featured: true
weight: 20
---
