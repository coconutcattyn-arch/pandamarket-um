"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { defaultSchool } from "./constants";
import { createSupabaseServerClient } from "./supabase-server";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function avatarInitial(name: string, email: string) {
  return (name || email).trim().charAt(0).toUpperCase() || "P";
}

async function getSchoolId() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("schools")
    .select("id")
    .eq("slug", defaultSchool.slug)
    .single();

  if (error || !data?.id) {
    throw new Error("Cannot find default school.");
  }

  return data.id as string;
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

  const schoolId = await getSchoolId();
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    display_name: displayName,
    user_type: "regular",
    school_id: schoolId,
    school_slug: defaultSchool.slug,
    avatar_initial: avatarInitial(displayName, email)
  });

  if (profileError) {
    redirect(`/register?error=${encodeURIComponent(profileError.message)}`);
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
