import { format } from 'date-fns';

interface ActivityHeatmapProps {
  matchs: { date: string; buts: number; passes: number; minutes: number }[];
}

export const ActivityHeatmap = ({ matchs }: ActivityHeatmapProps) => {
  const getIntensity = (match: typeof matchs[0]) => {
    return match.minutes > 0 ? Math.min(4, Math.floor((match.buts * 2 + match.passes) / 2) + 1) : 0;
  };

  return (
    <div className="grid grid-cols-6 gap-1">
      {matchs.slice(-12).map((match, idx) => (
        <div
          key={idx}
          className={`
            w-8 h-8 rounded-md transition-all
            ${getIntensity(match) === 0 ? 'bg-gray-800' : ''}
            ${getIntensity(match) === 1 ? 'bg-green-900/50' : ''}
            ${getIntensity(match) === 2 ? 'bg-green-700/70' : ''}
            ${getIntensity(match) === 3 ? 'bg-green-500' : ''}
            ${getIntensity(match) === 4 ? 'bg-green-400 shadow-glow' : ''}
          `}
          title={`${format(new Date(match.date), 'dd/MM')}: ${match.buts} buts, ${match.passes} passes`}
        />
      ))}
      {matchs.length === 0 && (
        <div className="col-span-6 text-xs text-content-muted italic">Aucune activité récente</div>
      )}
    </div>
  );
};
