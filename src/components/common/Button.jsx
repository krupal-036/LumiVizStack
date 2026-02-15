export default function Button({
  children,
  variant = "primary",
  ...props
}) {
  const base =
    "px-4 py-2 rounded text-white font-medium transition";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    success: "bg-green-600 hover:bg-green-700",
    danger: "bg-red-600 hover:bg-red-700",
    dark: "bg-gray-800 hover:bg-gray-900",
  };

  return (
    <button
      className={`${base} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
