const Pill = ({ children, className = '', ...props }) => {
  return (
    <span
      className={`px-2 py-1 bg-accent/10 text-accent text-xs rounded-full ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Pill;