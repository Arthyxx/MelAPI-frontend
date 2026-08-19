interface StarsProps {
  value: number;
}

interface StarsInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function Stars({
  value,
}: StarsProps) {
  return (
    <>
      {Array.from(
        { length: 5 },
        (_, index) => {
          const filled =
            index < value;

          return (
            <span
              key={index}
              className={
                filled
                  ? 'text-yellow-500'
                  : 'text-gray-300'
              }
            >
              ★
            </span>
          );
        },
      )}
    </>
  );
}

export function StarsInput({
  value,
  onChange,
  disabled = false,
}: StarsInputProps) {
  return (
    <>
      {Array.from(
        { length: 5 },
        (_, index) => {
          const rating =
            index + 1;

          const selected =
            rating <= value;

          return (
            <button
              key={rating}
              type="button"
              onClick={() =>
                onChange(rating)
              }
              disabled={disabled}
              className={`text-4xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 ${
                selected
                  ? 'text-yellow-500'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
              aria-label={`Avaliar com ${rating} estrela${
                rating > 1
                  ? 's'
                  : ''
              }`}
            >
              ★
            </button>
          );
        },
      )}
    </>
  );
}