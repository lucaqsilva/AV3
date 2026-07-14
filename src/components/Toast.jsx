import Icon from './Icons.jsx'

export default function Toast({ message }) {
  return <div className="toast" role="status"><span><Icon name="check" size={17} /></span>{message}</div>
}
