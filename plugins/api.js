import Logger from '~/utils/Logger'

const { debug: dg } = Logger('@:API')

class ApiError extends Error {
  constructor(message, response) {
    super(message)
    this.response = response
  }
}

// https://nuxt.com/docs/guide/recipes/custom-usefetch
export default defineNuxtPlugin((nuxtApp) => {
  const fetchClient = $fetch.create({
    baseURL: '/api',

    onRequest(context) {
      const requestId = Math.random().toString(32).substring(2).substring(2, 7)
      dg(`#${requestId} -->>〘 ${context.options.method} 〙${context.options.endpoint.url}`)
      context.requestId = requestId
      context.startTime = performance.now() // 開始時間
      context.options.headers = {
        ...context.options.headers,
        ...context.options.customHeaders,
        'X-XSRF-TOKEN': useCookie('XSRF-TOKEN').value, // CSRF Token
      }
    },

    onResponse({ options, requestId, startTime }) {
      const endTime = performance.now() // 終了時間
      const processingTime = Math.floor(endTime - startTime)
      const { endpoint, method } = options
      dg(`#${requestId} <<--〘 ${method} 〙${endpoint.url}`, { processingTime })
    },

    async onResponseError({ response }) {
      dg('==== onResponseError ====', response)
      throw new ApiError(response.statusText, response)
    },
  })

  /**
   * DutyからのAPI呼び出し用途。
   * @see https://github.com/unjs/ofetch
   * @param {object} endpoint - Endpoints.jsで定義されたエンドポイント
   * @param {object} order - パラメータやリクエストボディ
   */
  const api = async (endpoint, order) => {
    const { method, url: epUrl, type } = endpoint
    let { headers: customHeaders, pathVariables, query, body, multipart } = order || {}
    const url = resolveUrl(epUrl, pathVariables)
    switch (method) {
      case 'GET':
        if (type) {
          switch (type) {
            case 'DOWNLOAD': {
              const res = await fetchClient.raw(url, { endpoint, customHeaders, method: 'GET', query, responseType: 'arrayBuffer' })
              return invokeDownload(res)
            }
            default:
              break
          }
        }
        return fetchClient(url, { endpoint, customHeaders, method: 'GET', query })
      case 'POST':
        if (multipart) {
          body = resolveMultipart(multipart)
        }
        return fetchClient(url, { endpoint, customHeaders, method: 'POST', query, body })
      case 'PUT':
        return fetchClient(url, { endpoint, customHeaders, method: 'PUT', query, body })
      case 'DELETE':
        return fetchClient(url, { endpoint, customHeaders, method: 'DELETE', query })
      default:
        break
    }
  }

  nuxtApp.provide('api', api)
})

async function invokeDownload(res) {
  const cd = res.headers.get('content-disposition')
  const filename = extractFilename(cd)
  fileDownload(res._data, filename)
}

function extractFilename(contentDisposition) {
  const cd = contentDisposition
  const rawFilename = cd.includes('\'\'')
    ? cd.substring(cd.indexOf('\'\'') + 2, cd.length)
    : cd.match(/filename="(.*)"/)[1]
  return decodeURIComponent(rawFilename)
}

function fileDownload(file, filename) {
  const url = URL.createObjectURL(new Blob([file]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(url)
  link.parentNode.removeChild(link)
}

function resolveUrl(url, pathVariables) {
  return Object.keys(pathVariables || {}).reduce((acc, key) => {
    return acc.replace(`{${key}}`, pathVariables[key])
  }, url)
}

function resolveMultipart(multipart) {
  const formData = new FormData()
  for (const mp of multipart) {
    const key = Object.keys(mp).shift()
    if (mp[key] instanceof File) {
      formData.append(key, mp[key])
    }
    else if (typeof mp === 'object') {
      formData.append(key, new Blob([JSON.stringify(mp[key])], { type: 'application/json' }))
    }
  }
  return formData
}
