# Ebike Safari — scripts

Python pipeline: FIT ingest → static web JSON (+ optional video/transcript).

| Script | Role |
|--------|------|
| [`pipeline.py`](pipeline.py) | Orchestrator (`--sync`, `--videos-dir`) |
| [`sync_flow_trips.py`](sync_flow_trips.py) | iPhone USB → Bosch Flow Documents |
| [`build_web_assets.py`](build_web_assets.py) | FIT → manifest + GeoJSON + series |
| [`inspect_fit.py`](inspect_fit.py) | Bosch duplicate-row diagnostics |
| [`sync_video.py`](sync_video.py) | ffprobe → GPS interpolation |
| [`map_transcript.py`](map_transcript.py) | Whisper words on route |
| [`import_trip_pg.py`](import_trip_pg.py) | manifest + GeoJSON → PostGIS |
| [`fit_io.py`](fit_io.py) | Shared FIT parsing |
| [`transcript_*.py`](transcript_io.py) | Transcript clustering helpers |

Contract: [`../DATA-CONTRACT.md`](../DATA-CONTRACT.md)  
Design (what comes next): [`../design/ARCHITECTURE.yml`](../design/ARCHITECTURE.yml)

```bash
pip install fitparse pymobiledevice3 psycopg2-binary
python pipeline.py --sync --trips-dir ../demo/rides --out ../demo/web/data \
  --home-label "Demo City" --home-lat 52.0 --home-lon 5.0
python import_trip_pg.py --data-dir ../demo/web/data
```

↑ [`../README.md`](../README.md)
