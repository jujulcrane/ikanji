import { ReactNode } from 'react';

interface ButtonProps {
  onClick(): void;
  children: ReactNode;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`px-2 py-1 font-medium rounded-md w-full 
    ${disabled ? 'bg-customGold cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
