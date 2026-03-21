import { useState } from 'react';

interface StatItemProps {
  label: React.ReactNode;
  value: string;
  tooltip: string;
}

const StatItem = ({ label, value, tooltip }: StatItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className='relative flex cursor-default flex-col items-center gap-0.5'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className='text-sm text-overlay1'>{label}</span>
      <span className='text-xl text-foreground'>{value}</span>
      {showTooltip && (
        <div className='
          absolute top-full z-10 mt-1 rounded-md bg-overlay0 px-2 py-1 text-xs
          whitespace-pre text-foreground
        '>
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default StatItem;
