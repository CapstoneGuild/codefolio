import { Link } from "react-router-dom"

const SideMenuItem = ({ icon, text, to}) => {
  return (
    <Link className="menu-item" to={to}>
      {icon}
      <span>{text}</span>
    </Link>
  )
}

export default SideMenuItem