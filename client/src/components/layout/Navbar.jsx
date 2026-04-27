import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import AccountMenu from '../ui/AccountMenu';
import useAuthSession from '../../hooks/useAuthSession';

// Components
import SearchBar from '../ui/SearchBar';
import GlobalModal from '../ui/GlobalModal';
import CreateProject from '../ui/CreateProject';

// Icons
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Tooltip from "@mui/material/Tooltip"
import AddIcon from '@mui/icons-material/Add';

// Images
import Codefolio from '../../assets/logo/codefolio.svg'
import CodefolioDark from '../../assets/logo/codefolio-dark.svg'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useAuthSession()

  const [openCreateProject, setOpenCreateProject] = useState(false)

  const [theme, setTheme] = useState(() => {
      return localStorage.getItem("theme") || "light"
  })

  useEffect(() => {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <div className="w-full border-b border-border">
      <div className="max-w-9/10 mx-auto flex items-center justify-between h-25 px-4 sm:px-6 lg:px-8">
        
        {/* Left */}
        <div className='w-40 sm:w-52 lg:w-60'>
          {theme === "light" 
            ? <Link to="/"><img src={CodefolioDark} alt="Codefolio" className="w-10"/></Link>
            : <Link to="/"><img src={Codefolio} alt="Codefolio" className="w-10"/></Link>
          }
        </div>

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Right */}
        <div className='flex items-center justify-end gap-4 w-40 sm:w-52 lg:w-60'>
          <Tooltip title="Add Project" arrow>
            <button onClick={() => setOpenCreateProject(true)}>
              <AddIcon />
            </button>
          </Tooltip>
          <button onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}>
            {theme === "light" ? <DarkModeIcon /> : <LightModeOutlinedIcon />}
          </button>
          <AccountMenu user={user} navigate={navigate}/>
        </div>
      </div>

      <GlobalModal
				open={openCreateProject}
				onClose={() => setOpenCreateProject(false)}
				element={<CreateProject onClose={() => setOpenCreateProject(false)} />}
			/>
    </div>
  )
}

export default Navbar