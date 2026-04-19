import ErrorIcon from '@mui/icons-material/Error';

const ErrorMessage = () => {

  return (
    <div className='flex flex-col gap-4 items-center justify-center'>
      <ErrorIcon sx={{ fontSize:'6rem'}} />
      <span>Oops! An error occured.</span>
    </div>
  )
}

export default ErrorMessage