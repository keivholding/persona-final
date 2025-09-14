type Props = {
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
};

const Toggle = ({ checked = false, onChange, disabled = false }: Props) => {
  return (
    <button
      aria-pressed={checked}
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        disabled 
          ? "bg-gray-300 cursor-not-allowed" 
          : checked ? "bg-indigo-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full ${
          disabled ? "bg-gray-100" : "bg-white"
        } transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default Toggle;

