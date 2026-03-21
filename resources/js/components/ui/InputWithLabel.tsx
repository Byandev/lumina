export default function InputWithLabel({
                                           label = "Label",
                                           icon = "Icon",
                                           placeholder = "text here..",
                                           type = "text",
                                           value = "",
                                           onChange,
                                           error = "",
                                           disabled = false,
                                           className = ""
                                       }) {
    return (
        <div className={className}>
            <div className={`
        flex items-center gap-2 border px-3 h-9
        ${error
                ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500'
                : 'border-gray-300 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500'
            }
        ${disabled && 'bg-gray-100 opacity-60'}
      `}>
                {/* Icon */}
                <div className="text-gray-500 text-sm">{icon}</div>

                {/* Label */}
                <label className="text-gray-500 text-sm whitespace-nowrap">
                    {label}:
                </label>

                {/* Input */}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="flex-1 outline-none bg-transparent h-full min-w-0"
                />
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}
