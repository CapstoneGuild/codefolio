import { NavLink } from "react-router-dom"

const SideMenuItem = ({ icon, text, to}) => {
  return (
    <NavLink 
      className={({ isActive }) =>
        `menu-item transition 
        ${isActive 
          ? "bg-primary text-surface font-medium" 
          : "text-app hover:bg-primary/50"}`
      }
      to={to}
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  )
}

export default SideMenuItem