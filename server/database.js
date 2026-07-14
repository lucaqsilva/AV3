import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const dataDirectory = join(currentDirectory, '..', '.data')
mkdirSync(dataDirectory, { recursive: true })

const database = new DatabaseSync(join(dataDirectory, 'products.db'))

database.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL CHECK (price > 0),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    description TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT
  );
`)

const productCount = database.prepare('SELECT COUNT(*) AS total FROM products').get().total

if (productCount === 0) {
  const insert = database.prepare(`
    INSERT INTO products (id, name, category, price, quantity, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  insert.run(crypto.randomUUID(), 'Mouse sem fio', 'Eletrônicos', 89.9, 14, 'Mouse ergonômico com conexão USB e bateria de longa duração.', new Date().toISOString())
  insert.run(crypto.randomUUID(), 'Caderno executivo', 'Escritório', 34.5, 3, 'Caderno de capa dura com 160 páginas pautadas.', new Date().toISOString())
}

const selectColumns = `
  id, name, category, price, quantity, description,
  created_at AS createdAt, updated_at AS updatedAt
`

export const productRepository = {
  list() {
    return database.prepare(`SELECT ${selectColumns} FROM products ORDER BY created_at DESC`).all()
  },

  find(id) {
    return database.prepare(`SELECT ${selectColumns} FROM products WHERE id = ?`).get(id)
  },

  create(product) {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    database.prepare(`
      INSERT INTO products (id, name, category, price, quantity, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, product.name, product.category, product.price, product.quantity, product.description, createdAt)
    return this.find(id)
  },

  update(id, product) {
    const updatedAt = new Date().toISOString()
    const result = database.prepare(`
      UPDATE products
      SET name = ?, category = ?, price = ?, quantity = ?, description = ?, updated_at = ?
      WHERE id = ?
    `).run(product.name, product.category, product.price, product.quantity, product.description, updatedAt, id)
    return result.changes ? this.find(id) : null
  },

  remove(id) {
    return database.prepare('DELETE FROM products WHERE id = ?').run(id).changes > 0
  },
}
