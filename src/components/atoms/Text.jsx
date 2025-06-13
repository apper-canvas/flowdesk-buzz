const Text = ({ children, className = '', variant = 'p', ...props }) => {
  const Tag = variant; // 'p', 'span', 'div', etc.
  let baseClasses = 'text-gray-600';

  if (variant === 'span') {
    baseClasses = 'text-sm text-gray-500';
  }

  return (
    <Tag className={`${baseClasses} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Text;