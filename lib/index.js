const historyApiFallback = (options) => ({
  name: 'historyApiFallback',
  configureServer(server) {
    return () => {
      const rewrites = options.rewrites
      const logger = getLogger(options)
      server.middlewares.use((req, _, next) => {
        const accept = req.header && (req.header.accept || req.header.Accept) || ''
        if (req.method !== 'GET') {
          logger('Not rewriting', req.method, req.url, 'because the method is not GET.')
          return next()
        } else if (typeof accept  !== 'string') {
          logger('Not rewriting', req.method, req.url, 'because the client did not send an HTTP accept header.')
          return next()
        } else if (accept.includes('application/json')) {
          logger('Not rewriting', req.method, req.url, 'because the client prefers JSON.')
          return next()
        }
        req.url = evaluateRewrite(req, rewrites)
        return next()
      })
    }
  }
})

function evaluateRewrite (req, rewrites) {
  const rewriteTarget = rewrites.find(rewrite => {
    const rule = rewrite.from
    const originalUrl = req.originalUrl
    if (typeof rule === 'function') {
      return rule(originalUrl)
    } else if (rule instanceof RegExp) {
      return rewrite.from.test(originalUrl)
    } else {
      throw new Error('[rewrite.to] can only be of type RegExp or function.')
    }
  })
  return rewriteTarget ? rewriteTarget.to : 'index.html'
}

function loop () {}

function getLogger (options) {
  if (options.logger) {
    return options.logger
  } else if (options && options.DEBUG) {
    return console.log.bind(console)
  }
  return loop
}

module.exports = historyApiFallback