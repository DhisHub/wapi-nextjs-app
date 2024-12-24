"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPasswordAction } from "@/app/actions";

const ForgotPassPage = () => {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = (formData: FormData) => {
    const email = formData.get("email") as string;
    const newErrors: { email?: string } = {};
    if (!email) {
      newErrors.email = "Email is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!validateForm(formData)) return;

    const result = await forgotPasswordAction(formData);

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
                <div className="mb-8">
                  <label
                    htmlFor="email"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none ${
                      errors.email ? "border-red-500" : "focus:border-primary"
                    }`}
                  />
                  {errors.email && (
                    <p key="email-error" className="text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

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

                <div className="mb-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
              <p className="text-center text-base font-medium text-body-color">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassPage;
