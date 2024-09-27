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

export async function getNoti(token) {
  const userId = supabase.auth.currentUser.id;

  const res = await supabase
    .from("profiles")
    .update({ expo_push_token: token })
    .eq("user_id", userId);

  return res;
}
