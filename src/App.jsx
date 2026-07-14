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
  const [products, setProducts] = useState(() => productService.list())
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [sort, setSort] = useState('recent')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState('')

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

  const saveProduct = (values) => {
    if (editing) {
      productService.update(editing.id, values)
      setToast('Produto atualizado com sucesso!')
    } else {
      productService.create(values)
      setToast('Produto cadastrado com sucesso!')
    }
    setProducts(productService.list())
    closeForm()
  }

  const deleteProduct = () => {
    productService.remove(deleting.id)
    setProducts(productService.list())
    setDeleting(null)
    setToast('Produto excluído com sucesso!')
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

          <ProductList products={filteredProducts} onEdit={openEdit} onDelete={setDeleting} onNewProduct={openCreate} />
        </section>
      </main>

      <footer className="page-footer"><div className="shell">Stockly <span>•</span> Projeto acadêmico desenvolvido com React</div></footer>
      {formOpen && <ProductForm product={editing} onSubmit={saveProduct} onClose={closeForm} />}
      {deleting && <ConfirmDialog product={deleting} onConfirm={deleteProduct} onCancel={() => setDeleting(null)} />}
      {toast && <Toast message={toast} />}
    </>
  )
}
