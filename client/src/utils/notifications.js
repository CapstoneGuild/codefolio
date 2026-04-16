import { toast } from "react-toastify"

const defaultOptions = {
	position: 'top-center',
	autoClose: 3000,
	hideProgressBar: true,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	theme: 'light'
}

const notifySuccess = (message, options = {}) => toast.success(message, { ...defaultOptions, ...options })
const notifyError = (message, options = {}) => toast.error(message, { ...defaultOptions, ...options })
const notifyInfo = (message, options = {}) => toast.info(message, { ...defaultOptions, ...options })
const notifyWarning = (message, options = {}) => toast.warn(message, { ...defaultOptions, ...options })

export {
	defaultOptions,
	notifySuccess,
	notifyError,
	notifyInfo,
	notifyWarning
}