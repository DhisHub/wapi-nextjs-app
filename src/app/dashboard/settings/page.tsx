"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { createClClient } from "@/utils/supabase/client";
import { deleteUserAccount, generateToken } from "@/app/actions";
import { useRouter } from "next/navigation";
// import { createClClient } from "@/utils/supabase/server";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [token, setToken] = useState(null);

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Validate passwords
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const supabase = createClClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setSuccess("Password changed successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true); // Show loading
      setError(null); // Reset errors
      try {
        const supabase = await createClClient();
        // Fetch authenticated user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError; // Handle auth errors
        setUser(user); // Set user info directly
      } catch (err: any) {
        setError(err.message); // Capture errors
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClClient();

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect or perform any action after logout
      window.location.href = "/"; // Redirect to login page after logout
    } catch (err) {
      console.error("Error logging out:", err.message);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const supabase = createClClient();
        // Get the logged-in user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error("User not found fetToken:", authError?.message);
          return;
        }

        // Fetch the token from the 'tokens' table
        const { data, error } = await supabase
          .from("tokens") // Table name
          .select("token") // Select the 'token' field
          .eq("user_id", user.id) // Filter by user ID
          .order("created_at", { ascending: false }) // Get the latest token
          .limit(1); // Fetch only the latest token

        if (error) {
          throw new Error("Error fetching token: " + error.message);
        }

        if (data && data.length > 0) {
          setToken(data[0].token); // Set the token in state
        } else {
          console.log("No token found for the user.");
        }
      } catch (err) {
        console.error("Failed to fetch token:", err.message);
      }
    };

    fetchToken(); // Call the function inside useEffect
  }, []);

  const handleGenToken = async () => {
    try {
      const supabase = createClClient();

      // Check Active Session and Retrieve User
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error("No active session found:", error?.message);
        return;
      }

      const user = data.session.user;
      if (!user) {
        console.error("User not found in session.");
        return;
      }

      // Generate and Store Token
      const token = await generateToken(user.id);

      if (token) {
        console.log("Token generated:", token);
        setToken(token); // Update local state
      } else {
        console.log("Failed to generate token.");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleDeleteAcc = async () => {
    try {
      const supabase = createClClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("User not found:", error?.message);
        return;
      }

      // Call the server-side function to delete the user
      const result = await deleteUserAccount(user.id);

      if (result.error) {
        throw new Error(result.error);
      }

      // Sign out the user
      await supabase.auth.signOut();
      router.push("/"); // Redirect to the home page
    } catch (err: any) {
      console.error("Failed to delete account:", err.message);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Loading State */}
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                user && (
                  <div>
                    <div>
                      <strong>Account Name</strong>
                      <p>{user.user_metadata?.name || "Not Provided"}</p>
                    </div>
                    <div>
                      <strong>Emain</strong>
                      <p>{user.email || "Not Provided"}</p>
                    </div>
                    <div>
                      <strong>Tell Number</strong>
                      <p>{user.phone || "Not Provided"}</p>
                    </div>
                    <div>
                      <strong>Password</strong>
                      <p>*************</p>
                    </div>
                  </div>
                )
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-fit">
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Make sure you remember your new password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Input
                        id="new_pass"
                        placeholder="New password"
                        type="password"
                        className="col-span-3"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Input
                        id="conf_pass"
                        placeholder="Confirm new password"
                        type="password"
                        className="col-span-3"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  {success && <p className="text-green-500">{success}</p>}
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </CardContent>
        <CardHeader>
          <CardTitle>API</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <strong>Base URL</strong>
                <p>http://198.7.119.111:4000/api/</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <strong>API Token</strong>
                {token && (
                  <p className="break-all">{token || "No token provided"}</p>
                )}
              </div>
              <Button
                onClick={handleGenToken}
                variant="outline"
                className="w-fit"
              >
                Generate Token
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleLogout} className="text-white">
            Logout
          </Button>
          <Button
            onClick={handleDeleteAcc}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
