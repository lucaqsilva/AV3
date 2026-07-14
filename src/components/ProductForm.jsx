import { useEffect, useRef, useState } from 'react'
import { categories } from '../data/categories.js'
import Icon from './Icons.jsx'

const emptyForm = { name: '', category: '', price: '', quantity: '', description: '' }

function validate(values) {
  const errors = {}
  const name = values.name.trim()
  const price = Number(values.price)
  const quantity = Number(values.quantity)

  if (!name) errors.name = 'Informe o nome do produto.'
  else if (name.length < 3) errors.name = 'Use pelo menos 3 caracteres.'
  else if (name.length > 80) errors.name = 'Use no máximo 80 caracteres.'
  if (!values.category) errors.category = 'Selecione uma categoria.'
  if (values.price === '') errors.price = 'Informe o preço.'
  else if (!Number.isFinite(price) || price <= 0) errors.price = 'O preço deve ser maior que zero.'
  if (values.quantity === '') errors.quantity = 'Informe a quantidade.'
  else if (!Number.isInteger(quantity) || quantity < 0) errors.quantity = 'Use um número inteiro igual ou maior que zero.'
  if (values.description.length > 300) errors.description = 'Use no máximo 300 caracteres.'
  return errors
}

export default function ProductForm({ product, onSubmit, onClose }) {
  const [values, setValues] = useState(() => product ? {
    name: product.name,
    category: product.category,
    price: String(product.price),
    quantity: String(product.quantity),
    description: product.description || '',
  } : emptyForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const change = ({ target }) => {
    const next = { ...values, [target.name]: target.value }
    setValues(next)
    if (submitted) setErrors(validate(next))
  }

  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    onSubmit({
      name: values.name.trim(),
      category: values.category,
      price: Number(values.price),
      quantity: Number(values.quantity),
      description: values.description.trim(),
    })
  }

  const fieldError = (field) => errors[field] && <span className="field-error"><Icon name="alert" size={14} />{errors[field]}</span>

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <header className="modal__header">
          <div>
            <span className="eyebrow">Catálogo</span>
            <h2 id="form-title">{product ? 'Editar produto' : 'Cadastrar produto'}</h2>
            <p>{product ? 'Atualize as informações do item.' : 'Preencha os dados para adicionar um item.'}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar formulário"><Icon name="close" /></button>
        </header>

        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <label className="field field--wide">
              <span>Nome do produto <b>*</b></span>
              <input ref={nameRef} name="name" value={values.name} onChange={change} className={errors.name ? 'invalid' : ''} placeholder="Ex.: Teclado mecânico" maxLength="80" />
              {fieldError('name')}
            </label>
            <label className="field field--wide">
              <span>Categoria <b>*</b></span>
              <select name="category" value={values.category} onChange={change} className={errors.category ? 'invalid' : ''}>
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
              {fieldError('category')}
            </label>
            <label className="field">
              <span>Preço (R$) <b>*</b></span>
              <input type="number" name="price" value={values.price} onChange={change} className={errors.price ? 'invalid' : ''} placeholder="0,00" min="0.01" step="0.01" />
              {fieldError('price')}
            </label>
            <label className="field">
              <span>Quantidade <b>*</b></span>
              <input type="number" name="quantity" value={values.quantity} onChange={change} className={errors.quantity ? 'invalid' : ''} placeholder="0" min="0" step="1" />
              {fieldError('quantity')}
            </label>
            <label className="field field--wide">
              <span>Descrição <em>opcional</em></span>
              <textarea name="description" value={values.description} onChange={change} className={errors.description ? 'invalid' : ''} placeholder="Detalhes importantes sobre o produto..." rows="3" maxLength="300" />
              <span className="field-hint">{values.description.length}/300 caracteres</span>
              {fieldError('description')}
            </label>
          </div>
          <footer className="modal__footer">
            <button className="button button--ghost" type="button" onClick={onClose}>Cancelar</button>
            <button className="button button--primary" type="submit"><Icon name="check" size={18} />{product ? 'Salvar alterações' : 'Cadastrar produto'}</button>
          </footer>
        </form>
      </section>
    </div>
  )
}
