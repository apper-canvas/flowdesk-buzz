const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  let baseClasses = 'px-4 py-2 rounded-lg transition-colors inline-flex items-center justify-center';
  
  switch (variant) {
    case 'primary':
      baseClasses += ' bg-primary text-white hover:bg-primary/90';
      break;
    case 'secondary':
      baseClasses += ' bg-secondary text-white hover:bg-secondary/90';
      break;
    case 'outline':
      baseClasses += ' border border-gray-300 text-gray-700 hover:bg-gray-50';
      break;
    case 'danger':
      baseClasses += ' bg-red-500 text-white hover:bg-red-600';
      break;
    case 'ghost':
      baseClasses += ' text-gray-700 hover:bg-gray-100';
      break;
    default:
      baseClasses += ' bg-primary text-white hover:bg-primary/90';
  }

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;