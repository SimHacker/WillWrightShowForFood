# Porter/Duff imaging — PostScript to WebGPU

Don keeps returning to **stencil-and-paint** compositing (Illustrator, not PhotoShop):

```
PostScript tiles (HyperLook/DUX)
  → Cairo + Pango (OLPC)
  → HTML / CSS / SVG / Canvas 2D (browser document layer)
  → WebGPU / WebGL holodeck (GPU compositor, nested — not either/or)
```

**Cairo** = same model as PostScript, better library. **SVG and Canvas** = web evolution. **WebGPU** =
throughput for city tiles, agents, pie menus (`@micropolis/render-core` HolodeckStage).

→ [`career/lineage.yml`](career/lineage.yml) (`imaging_model_lineage`) · MicropolisCore [`platform-lineage-index.md`](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/platform-lineage-index.md)
