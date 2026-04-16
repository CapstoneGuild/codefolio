const sizeClasses = {
	sm: 'h-5 w-5',
	md: 'h-8 w-8',
	lg: 'h-12 w-12'
}

const LoadingSpinner = ({  fullScreen = false, size = 'md', className = '' }) => {
	const containerClasses = fullScreen
		? 'min-h-screen flex items-center justify-center bg-app-bg text-text-primary'
		: 'inline-flex items-center gap-3 text-text-primary'

	return (
		<div className={`${containerClasses} ${className}`.trim()} role="status" aria-live="polite" aria-busy="true">
			<svg
				className={`animate-spin ${sizeClasses[size] || sizeClasses.md}`}
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
			>
				<circle
					className="opacity-20"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-80"
					d="M22 12a10 10 0 0 0-10-10"
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
				/>
			</svg>
		</div>
	)
}

export default LoadingSpinner