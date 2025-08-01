type EventProps = {
  title: string;
  description: string;
  eventDate: string;
  tier: 'free' | 'silver' | 'gold' | 'platinum';
  imageUrl: string;
};

const tierColors: Record<EventProps['tier'], string> = {
  free: 'bg-gray-200 text-black',
  silver: 'bg-gray-400 text-white',
  gold: 'bg-yellow-400 text-black',
  platinum: 'bg-purple-600 text-white',
};

export default function EventCard({ title, description, eventDate, tier, imageUrl }: EventProps) {
  return (
    <div className="rounded-xl shadow-md overflow-hidden bg-white max-w-sm w-full">
      <img src={imageUrl} alt={title} className="h-48 w-full object-cover" />
      <div className="p-4">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${tierColors[tier]}`}>
          {tier.toUpperCase()}
        </div>
        <h2 className="mt-2 text-xl font-bold">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="mt-2 text-gray-500 text-sm">{new Date(eventDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
