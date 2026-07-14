import Icon from './Icons.jsx'
import { formatCurrency } from '../utils/formatters.js'

export default function Dashboard({ products }) {
  const units = products.reduce((total, product) => total + product.quantity, 0)
  const inventoryValue = products.reduce((total, product) => total + product.price * product.quantity, 0)
  const lowStock = products.filter((product) => product.quantity <= 5).length

  const cards = [
    { label: 'Produtos cadastrados', value: products.length, detail: `${units} unidades em estoque`, icon: 'box', tone: 'purple' },
    { label: 'Valor do estoque', value: formatCurrency(inventoryValue), detail: 'Preço × quantidade', icon: 'layers', tone: 'blue' },
    { label: 'Estoque baixo', value: lowStock, detail: '5 unidades ou menos', icon: 'alert', tone: lowStock ? 'orange' : 'green' },
  ]

  return (
    <section className="stats" aria-label="Resumo do estoque">
      {cards.map((card) => (
        <article className="stat-card" key={card.label}>
          <span className={`stat-card__icon stat-card__icon--${card.tone}`}><Icon name={card.icon} /></span>
          <div>
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            <small>{card.detail}</small>
          </div>
        </article>
      ))}
    </section>
  )
}
