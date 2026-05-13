import { createServer } from 'node:http'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultDataFile = resolve(__dirname, '../data/products.json')
const dataFile = resolve(process.env.CATALOG_DATA_FILE || defaultDataFile)
const port = Number(process.env.CATALOG_API_PORT || 4174)
const host = process.env.CATALOG_API_HOST || '127.0.0.1'

const persistentFields = ['code', 'description', 'canUpc', 'caseUpc', 'casesPerPallet']
let mutationQueue = Promise.resolve()

const sendJson = (res, status, body) => {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store'
  })
  res.end(payload)
}

const sendError = (res, status, message) => {
  sendJson(res, status, { error: message })
}

const readJsonBody = async (req) => {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) {
    return {}
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const readCatalogs = async () => {
  const raw = await readFile(dataFile, 'utf8')
  return JSON.parse(raw)
}

const writeCatalogs = async (catalogs) => {
  await mkdir(dirname(dataFile), { recursive: true })
  const tempFile = `${dataFile}.${process.pid}.${Date.now()}.tmp`
  await writeFile(tempFile, `${JSON.stringify(catalogs, null, 2)}\n`)
  await rename(tempFile, dataFile)
}

const cleanProduct = (product) => {
  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    throw new Error('Product must be an object.')
  }

  const cleaned = {}
  for (const field of persistentFields) {
    cleaned[field] = field === 'casesPerPallet'
      ? Number(product[field]) || 0
      : String(product[field] || '')
  }

  if (!cleaned.description.trim()) {
    throw new Error('Product description is required.')
  }

  return cleaned
}

const parseProductRoute = (pathname) => {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] !== 'api' || parts[1] !== 'catalogs' || !parts[2] || parts[3] !== 'products') {
    return null
  }

  return {
    catalog: decodeURIComponent(parts[2]),
    index: parts[4] === undefined ? null : Number(parts[4]),
    extraParts: parts.length > 5
  }
}

const enqueueMutation = (task) => {
  const run = mutationQueue.then(task, task)
  mutationQueue = run.catch(() => {})
  return run
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

    if (req.method === 'GET' && url.pathname === '/api/catalogs') {
      sendJson(res, 200, await readCatalogs())
      return
    }

    const productRoute = parseProductRoute(url.pathname)

    if (req.method === 'POST' && productRoute && productRoute.index === null && !productRoute.extraParts) {
      const product = cleanProduct(await readJsonBody(req))
      const catalogs = await enqueueMutation(async () => {
        const nextCatalogs = await readCatalogs()
        if (!Array.isArray(nextCatalogs[productRoute.catalog])) {
          const error = new Error('Catalog not found.')
          error.status = 404
          throw error
        }
        nextCatalogs[productRoute.catalog].push(product)
        await writeCatalogs(nextCatalogs)
        return nextCatalogs
      })
      sendJson(res, 201, catalogs[productRoute.catalog][catalogs[productRoute.catalog].length - 1])
      return
    }

    if (req.method === 'DELETE' && productRoute && productRoute.index !== null && !productRoute.extraParts) {
      if (!Number.isInteger(productRoute.index) || productRoute.index < 0) {
        sendError(res, 400, 'Product index must be a non-negative integer.')
        return
      }

      const removed = await enqueueMutation(async () => {
        const nextCatalogs = await readCatalogs()
        const catalogProducts = nextCatalogs[productRoute.catalog]
        if (!Array.isArray(catalogProducts)) {
          const error = new Error('Catalog not found.')
          error.status = 404
          throw error
        }
        if (productRoute.index >= catalogProducts.length) {
          const error = new Error('Product index not found.')
          error.status = 404
          throw error
        }

        const [deletedProduct] = catalogProducts.splice(productRoute.index, 1)
        await writeCatalogs(nextCatalogs)
        return deletedProduct
      })
      sendJson(res, 200, removed)
      return
    }

    sendError(res, 404, 'Not found.')
  } catch (error) {
    if (error instanceof SyntaxError) {
      sendError(res, 400, 'Request body must be valid JSON.')
      return
    }

    sendError(res, error.status || 500, error.message || 'Unexpected server error.')
  }
})

server.listen(port, host, () => {
  console.log(`Catalog API listening on http://${host}:${port}`)
  console.log(`Catalog data file: ${dataFile}`)
})
