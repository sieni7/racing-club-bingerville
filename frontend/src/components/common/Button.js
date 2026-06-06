import { jsx as _jsx } from "react/jsx-runtime";
export const Button = ({ variant = 'primary', isLoading = false, children, className = '', ...props }) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    };
    return (_jsx("button", { className: `px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${className}`, disabled: isLoading, ...props, children: isLoading ? 'Chargement...' : children }));
};
