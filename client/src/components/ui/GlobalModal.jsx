import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
	height: '80%',
	borderRadius: '20px',
  boxShadow: 24,
	overflow: 'hidden'
}

const GlobalModal = ({ element }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  if (loading) return (
    <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
      <LoadingSpinner />
    </div>
  )

  if (error) return (
    <div className="w-full h-full flex items-center justify-center bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
      <ErrorMessage />
    </div>
  )

  return (
    <Modal
      aria-labelledby=""
      aria-describedby=""
      open={open}
      onClose={() => setOpen(false)}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div className="w-full h-full bg-app-bg overflow-hidden border border-muted shadow-sm max-w-none hover:shadow-md transition duration-300 text-app">
            {element}
          </div>
        </Box>
      </Fade>
    </Modal>
  )
}

export default GlobalModal