interface StepProgressProps {
  total: number;
  current: number;
}

export function StepProgress({ total, current }: StepProgressProps) {
  return (
    <div
      className="flex w-full max-w-md gap-2"
      role="progressbar"
      aria-label="Safety plan progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      {Array.from({ length: total }).map((_, index) => (
        <div key={index} className={`h-2 flex-1 rounded-full ${index <= current ? 'bg-brand-purple' : 'bg-brand-gray dark:bg-neutral-700'}`} />
      ))}
    </div>
  );
}
