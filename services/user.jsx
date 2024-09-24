import { supabase } from "./supabase";

export async function getUser() {
  const currentUser = supabase.auth.currentUser;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("userId", currentUser.id);

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  return data;
}
