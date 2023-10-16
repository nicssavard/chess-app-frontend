import clsx from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register: any;
  type: string;
  className?: string;
}

export default function FormInput({
  label,
  register,
  type,
  className,
  ...props
}: Props) {
  return (
    <div className="">
      {label && (
        <label className="text-sm font-medium text-gray-400">{label}</label>
      )}
      <div className="mt-1 mb-4">
        <input
          {...register}
          type={type}
          {...props}
          className={clsx(
            `p-2 rounded-md bg-gray-700 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg sm:text-2xl `,
            className
          )}
        />
      </div>
    </div>
  );
}
