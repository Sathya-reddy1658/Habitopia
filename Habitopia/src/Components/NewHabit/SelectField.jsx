import { Controller } from "react-hook-form";

export const SelectField = ({ label, name, control, options, className = "" }) => (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-white">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className="p-2 mt-1 placeholder:px-2 block w-full rounded-md border-gray-300 bg-white/20 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {options.map((option) => (
              <option key={option} value={option} className="text-black">
                {typeof option === 'string' ? option : option.emoji}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );