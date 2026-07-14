import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { productRepository } from './database.js'

const port = Number(process.env.PORT) || 3001
const distDirectory = join(process.cwd(), 'dist')
const allowedCategories = new Set(['Acessórios', 'Alimentos', 'Casa e decoração', 'Eletrônicos', 'Escritório', 'Outros', 'Vestuário'])

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
}

function sendJson(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(data))
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 1_000_000) request.destroy()
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(new Error('O corpo da requisição contém JSON inválido.'))
      }
    })
    request.on('error', reject)
  })
}

function validateProduct(input) {
  const product = {
    name: typeof input.name === 'string' ? input.name.trim() : '',
    category: typeof input.category === 'string' ? input.category : '',
    price: Number(input.price),
    quantity: Number(input.quantity),
    description: typeof input.description === 'string' ? input.description.trim() : '',
  }
  const errors = []

  if (product.name.length < 3 || product.name.length > 80) errors.push('O nome deve ter entre 3 e 80 caracteres.')
  if (!allowedCategories.has(product.category)) errors.push('A categoria informada é inválida.')
  if (!Number.isFinite(product.price) || product.price <= 0) errors.push('O preço deve ser maior que zero.')
  if (!Number.isInteger(product.quantity) || product.quantity < 0) errors.push('A quantidade deve ser um número inteiro não negativo.')
  if (product.description.length > 300) errors.push('A descrição deve ter no máximo 300 caracteres.')

  return { product, errors }
}

async function handleApi(request, response, pathname) {
  const match = pathname.match(/^\/api\/products(?:\/([^/]+))?$/)
  if (!match) return sendJson(response, 404, { message: 'Rota não encontrada.' })

  const id = match[1] ? decodeURIComponent(match[1]) : null

  if (request.method === 'GET' && !id) return sendJson(response, 200, productRepository.list())

  if (request.method === 'POST' && !id) {
    const { product, errors } = validateProduct(await readJson(request))
    return errors.length
      ? sendJson(response, 400, { message: errors[0], errors })
      : sendJson(response, 201, productRepository.create(product))
  }

  if (request.method === 'PUT' && id) {
    const { product, errors } = validateProduct(await readJson(request))
    if (errors.length) return sendJson(response, 400, { message: errors[0], errors })
    const updated = productRepository.update(id, product)
    return updated ? sendJson(response, 200, updated) : sendJson(response, 404, { message: 'Produto não encontrado.' })
  }

  if (request.method === 'DELETE' && id) {
    return productRepository.remove(id)
      ? (response.writeHead(204), response.end())
      : sendJson(response, 404, { message: 'Produto não encontrado.' })
  }

  return sendJson(response, 405, { message: 'Método não permitido.' })
}

function serveFrontend(response, pathname) {
  if (!existsSync(distDirectory)) return sendJson(response, 404, { message: 'Interface não compilada. Use npm run dev ou npm run build.' })

  const requested = pathname === '/' ? 'index.html' : normalize(pathname).replace(/^[/\\]+/, '')
  let filePath = join(distDirectory, requested)
  if (!filePath.startsWith(distDirectory) || !existsSync(filePath) || statSync(filePath).isDirectory()) filePath = join(distDirectory, 'index.html')
  response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' })
  createReadStream(filePath).pipe(response)
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname
  try {
    if (pathname.startsWith('/api/')) await handleApi(request, response, pathname)
    else serveFrontend(response, pathname)
  } catch (error) {
    console.error(error)
    if (!response.headersSent) sendJson(response, 500, { message: 'Erro interno ao acessar o banco de dados.' })
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`API e banco SQLite disponíveis em http://127.0.0.1:${port}`)
})
