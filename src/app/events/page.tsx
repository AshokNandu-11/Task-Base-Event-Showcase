'use client';

import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // you'll create this in next step

const tierRank = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
};

export default function EventsPage() {
  const { user } = useUser();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tier = (user?.publicMetadata?.tier as string) || "free";
  const userTierRank = tierRank[tier];
  const allowedTiers = Object.keys(tierRank).filter(
    (t) => tierRank[t] <= userTierRank
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .in("tier", allowedTiers);

        if (error) throw error;

        setEvents(data || []);
      } catch (err: any) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [tier]);

  return (
    <div className="p-6">
      <SignedOut>
        <p className="text-red-500">Please sign in to view events.</p>
      </SignedOut>

      <SignedIn>
        <h1 className="text-2xl font-bold mb-4">Events for: {tier.toUpperCase()} user</h1>

        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border p-4 rounded-xl shadow-md bg-white"
              >
                <h2 className="text-lg font-bold">{event.title}</h2>
                <p>{event.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.event_date).toLocaleDateString()}
                </p>
                <span className="text-sm mt-2 inline-block bg-blue-600 text-white px-2 py-1 rounded">
                  {event.tier.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </SignedIn>
    </div>
  );
}
