import debugLib from 'debug'

if (process.env.NODE_ENV === 'development') {
  debugLib.enable('@:*')
}

/**
 * debugレベルのログを表示するには DevTools のコンソールにて
 * ログレベルの“詳細”を有効にする必要あり。
 */
export default function Logger(namespace) {
  const debug = debugLib(namespace)
  debug.log = console.debug.bind(console)

  const log = debugLib(namespace)
  log.log = console.log.bind(console)

  const info = debugLib(namespace)
  info.log = console.info.bind(console)

  const warn = debugLib(namespace)
  warn.log = console.warn.bind(console)

  const error = debugLib(namespace)
  error.log = console.error.bind(console)

  return { debug, log, info, warn, error }
}
