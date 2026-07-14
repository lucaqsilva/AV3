import Icon from './Icons.jsx'

export default function ConfirmDialog({ product, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <section className="confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <span className="confirm__icon"><Icon name="trash" /></span>
        <h2 id="confirm-title">Excluir produto?</h2>
        <p>O produto <strong>{product.name}</strong> será removido permanentemente do catálogo.</p>
        <div className="confirm__actions">
          <button className="button button--ghost" type="button" onClick={onCancel}>Cancelar</button>
          <button className="button button--danger" type="button" onClick={onConfirm}>Sim, excluir</button>
        </div>
      </section>
    </div>
  )
}
