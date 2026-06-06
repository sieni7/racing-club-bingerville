import { Trophy, Calendar, Target } from 'lucide-react';
import { Card } from '../ui/Card';

interface MetricsCardsProps {
  victoires: number;
  defaites: number;
  buts: number;
  matchsRestants: number;
}

export const MetricsCards = ({ victoires, defaites, buts, matchsRestants }: MetricsCardsProps) => {
  const cards = [
    { title: 'Victoires', value: victoires, icon: Trophy, color: 'text-green-600' },
    { title: 'Défaites', value: defaites, icon: Target, color: 'text-red-600' },
    { title: 'Buts marqués', value: buts, icon: Trophy, color: 'text-blue-600' },
    { title: 'Matchs restants', value: matchsRestants, icon: Calendar, color: 'text-orange-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <Card key={card.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{card.title}</p>
              <p className="text-2xl font-bold dark:text-white">{card.value}</p>
            </div>
            <card.icon className={`w-8 h-8 ${card.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};
