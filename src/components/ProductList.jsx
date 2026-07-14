import Icon from './Icons.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

export default function ProductList({ products, onEdit, onDelete, onNewProduct }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <span><Icon name="box" size={30} /></span>
        <h3>Nenhum produto encontrado</h3>
        <p>Ajuste os filtros ou cadastre um novo item no catálogo.</p>
        <button className="button button--primary" type="button" onClick={onNewProduct}><Icon name="plus" size={18} />Novo produto</button>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const lowStock = product.quantity <= 5
        return (
          <article className="product-card" key={product.id}>
            <div className="product-card__top">
              <span className="category">{product.category}</span>
              <div className="card-actions">
                <button className="icon-button" type="button" onClick={() => onEdit(product)} aria-label={`Editar ${product.name}`}><Icon name="edit" size={18} /></button>
                <button className="icon-button icon-button--danger" type="button" onClick={() => onDelete(product)} aria-label={`Excluir ${product.name}`}><Icon name="trash" size={18} /></button>
              </div>
            </div>
            <h3>{product.name}</h3>
            <p className="product-card__description">{product.description || 'Produto sem descrição.'}</p>
            <div className="product-card__details">
              <div><small>Preço</small><strong>{formatCurrency(product.price)}</strong></div>
              <div><small>Estoque</small><strong className={lowStock ? 'stock-low' : ''}>{product.quantity} un.</strong></div>
            </div>
            <footer>
              <span>Cadastrado em {formatDate(product.createdAt)}</span>
              {lowStock && <span className="low-badge"><Icon name="alert" size={13} />Estoque baixo</span>}
            </footer>
          </article>
        )
      })}
    </div>
  )
}
