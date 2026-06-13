export function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label>
      <span className="label">{label}</span>
      <input className="field" type={type} placeholder={placeholder} />
    </label>
  );
}
