import React from "react";

interface ErrorMessageProps {
	message?: string;
	onRetry?: () => void;
}

// Reusable error display used across all fetch-dependent components.
// Shows a friendly message and an optional retry button when a fetch fails.
const ErrorMessage: React.FC<ErrorMessageProps> = ({
	message = "Something went wrong. Please try again.",
	onRetry,
}) => {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="size-10 text-red-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
				/>
			</svg>
			<p className="text-sm text-neutral-400">{message}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="btn btn-sm btn-outline mt-1">
					Try again
				</button>
			)}
		</div>
	);
};

export default ErrorMessage;
