const Button = ({ children, variant = 'primary', onClick, className = '', type = "button" }) => {
  const baseStyle = "px-6 py-2 rounded-full font-semibold transition-all duration-300 text-sm md:text-base";

  const variants = {
    primary: "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg border border-transparent",
    secondary: "bg-white text-green-500 border-2 border-green-500 hover:bg-green-50"
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
