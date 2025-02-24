import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`
        px-4 py-2.5 rounded-full border border-gray-200 bg-white text-gray-900 
        shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-blue-500 focus-visible:border-transparent
        disabled:cursor-not-allowed disabled:opacity-50 
        dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 
        dark:focus-visible:ring-blue-400 
        ${className}
      `}
      {...props}
    />
  )
}

export { Input }

