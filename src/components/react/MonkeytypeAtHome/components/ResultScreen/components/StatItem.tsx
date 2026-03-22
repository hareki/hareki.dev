import StarwindTooltip from '@/components/react/StarwindTooltip';

interface StatItemProps {
  label: React.ReactNode;
  value: string;
  tooltip: string;
}

const StatItem = ({ label, value, tooltip }: StatItemProps) => {
  return (
    <StarwindTooltip
      content={<span className='whitespace-pre'>{tooltip}</span>}
    >
      <div className='flex cursor-default flex-col items-center gap-0.5'>
        <span className='text-base text-overlay1'>{label}</span>
        <span className='text-xl text-primary'>{value}</span>
      </div>
    </StarwindTooltip>
  );
};

export default StatItem;
