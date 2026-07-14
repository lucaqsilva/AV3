const STORAGE_KEY = 'stockly-products-v1'

const sampleProducts = [
  {
    id: 'sample-1',
    name: 'Mouse sem fio',
    category: 'Eletrônicos',
    price: 89.9,
    quantity: 14,
    description: 'Mouse ergonômico com conexão USB e bateria de longa duração.',
    createdAt: '2026-07-12T10:00:00.000Z',
  },
  {
    id: 'sample-2',
    name: 'Caderno executivo',
    category: 'Escritório',
    price: 34.5,
    quantity: 3,
    description: 'Caderno de capa dura com 160 páginas pautadas.',
    createdAt: '2026-07-13T14:30:00.000Z',
  },
]

function save(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  return products
}

export const productService = {
  list() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : save(sampleProducts)
    } catch {
      return sampleProducts
    }
  },

  create(product) {
    const products = this.list()
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    save([newProduct, ...products])
    return newProduct
  },

  update(id, changes) {
    const products = this.list()
    const updated = products.map((product) =>
      product.id === id ? { ...product, ...changes, updatedAt: new Date().toISOString() } : product,
    )
    save(updated)
    return updated.find((product) => product.id === id)
  },

  remove(id) {
    save(this.list().filter((product) => product.id !== id))
  },
}

// Este serviço concentra o acesso aos dados. Para integrar uma API REST,
// substitua o localStorage por chamadas fetch sem alterar os componentes.
