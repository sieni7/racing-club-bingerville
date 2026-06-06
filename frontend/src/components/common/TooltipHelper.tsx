import { Tooltip } from 'react-tooltip';
import { Info } from 'lucide-react';

interface TooltipHelperProps {
  id: string;
  content: string;
  place?: 'top' | 'right' | 'bottom' | 'left';
}

export const TooltipHelper = ({ id, content, place = 'top' }: TooltipHelperProps) => {
  return (
    <>
      <span
        data-tooltip-id={id}
        data-tooltip-content={content}
        className="inline-flex items-center justify-center text-content-muted hover:text-primary transition-colors cursor-help ml-1"
      >
        <Info size={16} />
      </span>
      <Tooltip 
        id={id} 
        place={place}
        className="z-50 max-w-xs text-center"
        style={{ backgroundColor: '#1A1F2E', color: '#fff', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
      />
    </>
  );
};
