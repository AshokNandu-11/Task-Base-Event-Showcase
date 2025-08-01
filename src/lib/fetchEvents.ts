import { supabase } from "./supabase";

const tierOrder = ["free", "silver", "gold", "platinum"];

export async function fetchEventsForTier(userTier: string) {
  const index = tierOrder.indexOf(userTier);
  const allowedTiers = tierOrder.slice(0, index + 1);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .in("tier", allowedTiers);

  if (error) throw error;
  return data;
}
