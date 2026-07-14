import { useEffect, useMemo, useState } from 'react'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import Dashboard from './components/Dashboard.jsx'
import Header from './components/Header.jsx'
import Icon from './components/Icons.jsx'
import ProductForm from './components/ProductForm.jsx'
import ProductList from './components/ProductList.jsx'
import Toast from './components/Toast.jsx'
import { categories } from './data/categories.js'
import { productService } from './services/productService.js'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [sort, setSort] = useState('recent')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState('')

  const loadProducts = () => {
    setLoading(true)
    setLoadError('')
    productService.list()
      .then(setProducts)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    productService.list()
      .then((data) => {
        if (active) setProducts(data)
      })
      .catch((error) => {
        if (active) setLoadError(error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setFormOpen(false)
        setEditing(null)
        setDeleting(null)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    return products
      .filter((product) => category === 'Todas' || product.category === category)
      .filter((product) => !term || `${product.name} ${product.description}`.toLocaleLowerCase('pt-BR').includes(term))
      .toSorted((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR')
        if (sort === 'price-asc') return a.price - b.price
        if (sort === 'price-desc') return b.price - a.price
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
  }, [products, search, category, sort])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const saveProduct = async (values) => {
    try {
      if (editing) {
        const updated = await productService.update(editing.id, values)
        setProducts((current) => current.map((product) => product.id === updated.id ? updated : product))
        setToast('Produto atualizado com sucesso!')
      } else {
        const created = await productService.create(values)
        setProducts((current) => [created, ...current])
        setToast('Produto cadastrado com sucesso!')
      }
      closeForm()
    } catch (error) {
      setToast(error.message)
    }
  }

  const deleteProduct = async () => {
    try {
      await productService.remove(deleting.id)
      setProducts((current) => current.filter((product) => product.id !== deleting.id))
      setDeleting(null)
      setToast('Produto excluído com sucesso!')
    } catch (error) {
      setToast(error.message)
    }
  }

  return (
    <>
      <Header onNewProduct={openCreate} />
      <main id="inicio" className="shell main-content">
        <section className="hero">
          <div>
            <span className="eyebrow">Visão geral</span>
            <h1>Gestão de produtos</h1>
            <p>Cadastre, organize e acompanhe seu estoque em um só lugar.</p>
          </div>
        </section>

        <Dashboard products={products} />

        <section className="catalog" aria-labelledby="catalog-title">
          <div className="catalog__heading">
            <div>
              <h2 id="catalog-title">Catálogo</h2>
              <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p>
            </div>
          </div>

          <div className="filters">
            <label className="search-field">
              <Icon name="search" size={19} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou descrição..." aria-label="Buscar produtos" />
              {search && <button type="button" onClick={() => setSearch('')} aria-label="Limpar busca"><Icon name="close" size={16} /></button>}
            </label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoria">
              <option>Todas</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar produtos">
              <option value="recent">Mais recentes</option>
              <option value="name">Nome (A–Z)</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>

          {loading && <div className="empty-state"><h3>Carregando produtos...</h3><p>Consultando o banco de dados.</p></div>}
          {!loading && loadError && (
            <div className="empty-state">
              <span><Icon name="alert" size={30} /></span>
              <h3>Não foi possível carregar os produtos</h3>
              <p>{loadError}</p>
              <button className="button button--primary" type="button" onClick={loadProducts}>Tentar novamente</button>
            </div>
          )}
          {!loading && !loadError && <ProductList products={filteredProducts} onEdit={openEdit} onDelete={setDeleting} onNewProduct={openCreate} />}
        </section>
      </main>

      <footer className="page-footer"><div className="shell">Meu Armário <span>•</span> Projeto desenvolvido por Lucas Nicoli da Silva</div></footer>
      {formOpen && <ProductForm product={editing} onSubmit={saveProduct} onClose={closeForm} />}
      {deleting && <ConfirmDialog product={deleting} onConfirm={deleteProduct} onCancel={() => setDeleting(null)} />}
      {toast && <Toast message={toast} />}
    </>
  )
}
