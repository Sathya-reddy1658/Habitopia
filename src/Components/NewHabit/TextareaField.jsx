import { Controller } from "react-hook-form";

export const TextareaField = ({ label, name, control, rules, placeholder }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-white">{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <textarea
              {...field}
              rows="3"
              className="px-2 py-1 mt-1 placeholder:px-2 block w-full rounded-md border-gray-300 bg-white/20 text-white placeholder-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder={placeholder}
            ></textarea>
            {error && <span className="text-red-500 text-xs">{error.message}</span>}
          </>
        )}
      />
    </div>
  );
  
  