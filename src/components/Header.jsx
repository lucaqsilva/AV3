import Icon from './Icons.jsx'

export default function Header({ onNewProduct }) {
  return (
    <header className="topbar">
      <div className="shell topbar__content">
        <a className="brand" href="#inicio" aria-label="Meu Armário - início">
          <span className="brand__icon"><Icon name="box" size={23} /></span>
          <span className="brand__name">meu <strong>armário</strong></span>
        </a>
        <button className="button button--primary button--compact" type="button" onClick={onNewProduct}>
          <Icon name="plus" size={18} />
          <span>Novo produto</span>
        </button>
      </div>
    </header>
  )
}
