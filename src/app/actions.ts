"use server";

import { createSrClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSuClient } from "@/utils/supabase/super-server";
import jwt from "jsonwebtoken";
import { createClClient } from "@/utils/supabase/client";
import { createCuClient } from "@/utils/supabase/super-client";

export const signUpAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const supabase = createSrClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const { data, error: signUpError } = await (
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

  const user = data.user;
  if (!user || !user.id) {
    return { error: "Failed to retrieve user information after sign up." };
  }

  try {
    const supabase = createClClient();
    // Generate Short, Permanent Token
    const secret = process.env.JWT_SECRET!;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign({ id: user.id }, secret); // No expiration

    // Store Token in 'tokens' Table
    const { error } = await supabase.from("tokens").insert([
      {
        user_id: user.id, // Store the actual user ID
        token: token,
      },
    ]);

    if (error) {
      throw new Error("Failed to store token: " + error.message);
    }

    console.log("Token stored successfully:", token);
  } catch (err) {
    console.error("Error generating/storing token:", err.message);
    return { error: "Failed to generate or store token." };
  }

  return { success: "Thanks for signing up! Please check your email." };
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createSrClient();

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
  const supabase = await createSrClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  if (error) {
    console.error(error.message);
    return { error: "Could not reset password" };
  }

  return { success: "Check your email for a link to reset your password." };
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createSrClient();

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
  const supabase = await createSrClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const deleteUserAccount = async (userId: string) => {
  try {
    const supabase = createCuClient();
    // console.log(hasEnvVars);

    // Delete the user using the admin API
    const { error } = await (await supabase).auth.admin.deleteUser(userId);
    await supabase.from("tokens").delete().eq("user_id", userId);

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting account:", error.message);
    return { error: error.message };
  }
};

export const generateToken = async (userId: string) => {
  try {
    // Define Secret Key
    const secret = process.env.JWT_SECRET!;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    // Generate Short, Permanent Token
    const token = jwt.sign({ id: userId }, secret); // No 'exp' included

    // Initialize Supabase Client
    const supabase = createClClient();

    // Replace any previous tokens for the user
    await supabase.from("tokens").delete().eq("user_id", userId);

    // Store Token in Tokens Table
    const { error } = await supabase.from("tokens").insert([
      {
        user_id: userId,
        token: token,
      },
    ]);

    if (error) {
      throw new Error("Failed to store token in database: " + error.message);
    }

    console.log("Token stored successfully:", token);
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    return null;
  }
};
