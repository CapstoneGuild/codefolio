import authService from "../services/authService"
import { GitHub } from "@mui/icons-material"
import codefolioDark from '../assets/logo/codefolio-dark.svg'

const Login = () => {
  const handleLogin = () => {
    sessionStorage.setItem('oauth_login_pending', '1')
    authService.loginWithGitHub()
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-app-bg p-4 md:p-6">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center">
        <div className="hidden h-[86vh] w-[56%] items-center pr-6 lg:flex">
          <img
            src="https://picsum.photos/1200/1600"
            alt="login background"
            className="h-full w-full rounded-[2.25rem] object-cover"
          />
        </div>

        <div className="flex w-full items-center justify-center lg:w-[44%]">
          <div className="w-full max-w-md rounded-[2rem] border border-border bg-white/85 px-8 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:bg-slate-900/65 sm:px-10 sm:py-12">
            <div className="space-y-3 text-center">
              <img
                src={codefolioDark}
                alt="codefolio logo"
                className="mx-auto mb-6 h-20 w-20"
              />
              <h1 className="text-3xl font-semibold tracking-tight">codefolio</h1>
              <p className="text-sm sm:text-base text-text-secondary leading-6">
                A platform built by developers <br />for developers
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:!bg-black hover:!text-white"
            >
              <GitHub fontSize="small" />
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login