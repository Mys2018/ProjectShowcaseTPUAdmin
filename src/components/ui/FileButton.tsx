import { useRef } from 'react';
import { Button } from './Button';

interface FileButtonProps {
  label?: string;
  accept?: string;
  disabled?: boolean;
  loading?: boolean;
  onFile: (file: File) => void;
}

export function FileButton({
  label = 'Выбрать файл',
  accept,
  disabled,
  loading,
  onFile,
}: FileButtonProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="ui-file-btn">
      <input
        ref={ref}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
      <Button
        type="button"
        disabled={disabled || loading}
        loading={loading}
        onClick={() => ref.current?.click()}
      >
        {label}
      </Button>
    </div>
  );
}
