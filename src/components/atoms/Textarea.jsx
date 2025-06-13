const Textarea = ({ className = '', rows = 3, ...props }) => {
  return (
    <textarea
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default Textarea;