const Heading = ({ children, level = 1, className = '', ...props }) => {
  const Tag = `h${level}`;
  let baseClasses = 'font-heading font-bold text-gray-900';
  
  switch (level) {
    case 1:
      baseClasses += ' text-3xl';
      break;
    case 2:
      baseClasses += ' text-lg';
      break;
    case 3:
      baseClasses += ' text-lg';
      break;
    case 4:
      baseClasses += ' text-sm';
      break;
    default:
      baseClasses += ' text-lg';
  }

  return (
    <Tag className={`${baseClasses} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;