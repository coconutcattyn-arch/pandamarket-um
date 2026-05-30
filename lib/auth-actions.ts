"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureUserProfile } from "./profile-helpers";
import { createSupabaseServerClient } from "./supabase-server";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signUpAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    redirect("/register?error=missing_config");
  }

  const displayName = textValue(formData, "displayName");
  const email = textValue(formData, "email");
  const password = textValue(formData, "password");

  if (!displayName || !email || !password) {
    redirect("/register?error=missing_fields");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });

  if (error || !data.user) {
    redirect(`/register?error=${encodeURIComponent(error?.message ?? "signup_failed")}`);
  }

  const profileResult = await ensureUserProfile(supabase, {
    id: data.user.id,
    email,
    user_metadata: {
      display_name: displayName
    }
  });

  if (profileResult.error) {
    redirect(`/register?error=${encodeURIComponent(profileResult.error)}`);
  }

  revalidatePath("/");
  redirect("/login?registered=1");
}

export async function signInAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    redirect("/login?error=missing_config");
  }

  const email = textValue(formData, "email");
  const password = textValue(formData, "password");
  const next = textValue(formData, "next") || "/products";

  if (!email || !password) {
    redirect(`/login?error=missing_fields&next=${encodeURIComponent(next)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }

  revalidatePath("/");
  redirect(next);
}

export async function signOutAction() {
  const supabase = createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/");
  redirect("/");
}
