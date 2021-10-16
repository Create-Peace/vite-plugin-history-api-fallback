# vite-plugin-history-api-fallback

The middleware specifies the index page when multiple single page HTML5 history APIs are used


### Usage

```js
npm install vite-plugin-history-api-fallback
```

### vite config file
```js
import HistoryApiFallback from 'vite-plugin-history-api-fallback'

defineConfig({
  plugins: [
    HistoryApiFallback({
      DEBUG: true,
      rewrites: [
        { from: /^\/doc\/.*$/, to: '/index.html'},
        { from: /^\/mobile\/.*$/, to: '/mobile.html'},
      ]
    })
})

```
