import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function Field({ label, hint, error, children, htmlFor }: FieldProps) {
  return (
    <label className="ui-field" htmlFor={htmlFor}>
      {label ? <span className="ui-field-label">{label}</span> : null}
      {children}
      {hint && !error ? <span className="ui-field-hint">{hint}</span> : null}
      {error ? <span className="ui-field-error">{error}</span> : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="ui-input" {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="ui-textarea" {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="ui-select" {...props} />;
}
