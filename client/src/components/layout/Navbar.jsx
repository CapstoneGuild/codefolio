import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Avatar } from '@mui/material';

// Components
import SearchBar from '../ui/SearchBar';

// Icons
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

// Images
import Codefolio from '../../assets/logo/codefolio.svg'
import CodefolioDark from '../../assets/logo/codefolio-dark.svg'

const Navbar = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light"
    })

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

  return (
    <div className="flex justify-between h-20 p-4">
      <div className='w-60'>
        {theme === "light" 
            ? <Link to="/"><img src={CodefolioDark} alt="Codefolio" className="w-10"/></Link>
            : <Link to="/"><img src={Codefolio} alt="Codefolio" className="w-10"/></Link>
        }
      </div>
      {/* Search Component */}
      <SearchBar />

      <div className='w-60 flex flex-row items-center justify-end gap-4'>
        <a onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}>
          {theme === "light" ? <DarkModeIcon /> : <LightModeOutlinedIcon />}
        </a>
        {/* Pass user's name initials or display profile */}
        <div className='flex items-center justify-content-center'>
          <Avatar className="bg-black">MA</Avatar>
        </div>
      </div>
    </div>
  )
}

export default Navbar