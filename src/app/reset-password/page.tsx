"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { resetPasswordAction } from "@/app/actions";
import { useSearchParams, useRouter } from "next/navigation";
import { createClClient } from "@/utils/supabase/client";

const ResetPassPage = () => {
  const supabase = createClClient();
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setFormError("Session expired or invalid. Request a new reset link.");
        router.push("/signin");
        return;
      }
    };

    verifySession();
  }, []);

  const validateForm = (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Basic validation on the client side
    if (!validateForm(formData)) return;

    const result = await resetPasswordAction(formData);

    if (result?.error) {
      setFormError(result.error);
      setSuccessMessage(null);
    } else if (result?.success) {
      setSuccessMessage(result.success);
      setFormError(null);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px] ">
              <h3 className="mb-6 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Reset password
              </h3>

              <form onSubmit={handleSubmit}>
                {/* Password and Confirm Password Input */}
                <div className="mb-8">
                  <label
                    htmlFor="password"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none ${
                      errors.password
                        ? "border-red-500"
                        : "focus:border-primary"
                    }`}
                  />
                  {errors.password && (
                    <p key="password-error" className="text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="confirmPassword"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "focus:border-primary"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p
                      key="confirm-password-error"
                      className="text-sm text-red-500"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Success or Error Messages */}
                {successMessage && (
                  <div
                    key="success-message"
                    className="text-md mb-4 flex w-full max-w-md flex-col gap-2"
                  >
                    <div className="border-l-2 border-green-600 px-4 text-green-600">
                      {successMessage}
                    </div>
                  </div>
                )}
                {formError && (
                  <div
                    key="error-message"
                    className="text-md mb-4 flex w-full max-w-md flex-col gap-2"
                  >
                    <div className="border-l-2 border-red-600 px-4 text-red-600">
                      {formError}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mb-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassPage;
