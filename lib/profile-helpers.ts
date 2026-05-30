import { defaultSchool } from "./constants";
import type { createSupabaseServerClient } from "./supabase-server";

type SupabaseServerClient = NonNullable<ReturnType<typeof createSupabaseServerClient>>;

function avatarInitial(name: string, email: string) {
  return (name || email).trim().charAt(0).toUpperCase() || "P";
}

export async function getDefaultSchoolId(supabase: SupabaseServerClient) {
  const { data, error } = await supabase
    .from("schools")
    .select("id")
    .eq("slug", defaultSchool.slug)
    .single();

  if (error || !data?.id) {
    console.error("Failed to select default school", { error, data });
    throw new Error("Cannot find default school.");
  }

  return data.id as string;
}

export async function ensureUserProfile(
  supabase: SupabaseServerClient,
  user: {
    id: string;
    email?: string | null;
    user_metadata?: { display_name?: string; name?: string };
  }
) {
  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    console.error("Failed to select user profile", { userId: user.id, error: selectError });
    return { error: "读取用户资料失败，请稍后重试。" };
  }

  if (existingProfile?.id) {
    return { profileId: existingProfile.id as string };
  }

  const schoolId = await getDefaultSchoolId(supabase);
  const displayName = user.user_metadata?.display_name ?? user.user_metadata?.name ?? user.email ?? "PandaMarket 用户";
  const { error: upsertError } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: displayName,
    user_type: "regular",
    school_id: schoolId,
    school_slug: defaultSchool.slug,
    avatar_initial: avatarInitial(displayName, user.email ?? "")
  });

  if (upsertError) {
    console.error("Failed to upsert user profile", { userId: user.id, error: upsertError });
    return { error: "创建用户资料失败，请检查 profiles 权限或稍后重试。" };
  }

  return { profileId: user.id };
}
