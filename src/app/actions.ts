"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSuClient } from "@/utils/supabase/super-client";

export const signUpAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  console.log(name);
  const supabase = createClient();
  const origin = process.env.NEXT_PUBLIC_BASE_URL; // Replace with your base URL

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const { error: signUpError } = await (
    await supabase
  ).auth.signUp({
    email,
    password,
    options: {
      data: { name: name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  return { success: "Thanks for signing up! Please check your email." };
};

type SignInData = {
  email: string;
  password: string;
};
export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message }; // Return error message
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return { error: "Could not reset password" };
  }

  return { success: "Check your email for a link to reset your password." };
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return {
      error: "Password and confirm password are required",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { eror: "Password update failed" };
  }
  return { success: "Password updated" };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const deleteUserAccount = async (userId: string) => {
  try {
    const supabase = createSuClient();
    // console.log(hasEnvVars);

    // Delete the user using the admin API
    const { error } = await (await supabase).auth.admin.deleteUser(userId);

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting account:", err.message);
    return { error: err.message };
  }
};
