async function request(path = '', options = {}) {
  const response = await fetch(`/api/products${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Não foi possível acessar o banco de dados.')
  }

  return response.status === 204 ? null : response.json()
}

export const productService = {
  list() {
    return request()
  },

  create(product) {
    return request('', { method: 'POST', body: JSON.stringify(product) })
  },

  update(id, changes) {
    return request(`/${id}`, { method: 'PUT', body: JSON.stringify(changes) })
  },

  remove(id) {
    return request(`/${id}`, { method: 'DELETE' })
  },
}
