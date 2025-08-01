import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/utils/supabaseClient";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import dayjs from "dayjs";

const tiers = ["free", "silver", "gold", "platinum"];
const tierColors = {
  free: "bg-gray-300 text-black",
  silver: "bg-silver text-white",
  gold: "bg-yellow-400 text-black",
  platinum: "bg-purple-600 text-white",
};

export default async function HomePage() {
  const user = await currentUser();
  const userTier = (user?.publicMetadata?.tier as string) || "free";
  const currentTierIndex = tiers.indexOf(userTier);

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .in("tier", tiers.slice(0, currentTierIndex + 1));

  if (error) {
    console.error("Error loading events:", error.message);
    return <div className="text-red-500 p-4">Failed to load events.</div>;
  }

  return (
    
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.firstName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-[1.01] transition"
          >
            <Image
              src={event.image_url}
              alt={event.name || "Event image"} // Provide a meaningful alt text
              width={500}
              height={300}
            />

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    tierColors[event.tier]
                  }`}
                >
                  {event.tier.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{event.description}</p>
              <p className="text-sm mt-2 text-gray-500">
                📅 {dayjs(event.event_date).format("MMM D, YYYY h:mm A")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
