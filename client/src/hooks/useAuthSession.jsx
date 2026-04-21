import { useContext } from "react"
import AuthContext from "../context/AuthContext"

const useAuthSession = () => {
  return useContext(AuthContext)
}

export default useAuthSession