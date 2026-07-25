# hello-envoy

Marketing site for [hello-envoy.com](https://hello-envoy.com), deployed via GitHub Pages from `/docs`.

## Shader background

The animated background uses the official [`@shadergradient/react`](https://github.com/ruucm/shadergradient) package. Settings live in `src/shader-bg.jsx`.

After changing gradient props, rebuild:

```bash
npm install
npm run build:shader
```

This writes `docs/assets/shader-bg.js`, which `docs/index.html` loads.
