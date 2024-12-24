"use client";
import Link from "next/link";

import { Metadata } from "next";
import { signUpAction } from "../actions";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClClient } from "@/utils/supabase/client";

// export const metadata: Metadata = {
//   title: "Sign Up Page | Free Next.js Template for Startup and SaaS",
//   description: "This is Sign Up Page for Startup Nextjs Template",
//   // other metadata
// };

const SignupPage = () => {
  // const searchParams = await props.searchParams;
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClClient();

  useEffect(() => {
    const verifySession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        setFormError("You are already singn in");
        router.push("/dashboard");
        return;
      }
    };

    verifySession();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await signUpAction(formData);
    if (result?.error) {
      setFormError(result.error);
      setSuccessMessage(null);
    } else if (result?.success) {
      setSuccessMessage(result.success);
      setFormError(null);
    }
  };
  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
                {successMessage && (
                  <div className="text-md mb-4 flex w-full max-w-md flex-col gap-2">
                    <div className="border-l-2 border-green-600 px-4 text-green-600">
                      {successMessage}
                    </div>
                  </div>
                )}
                {formError && (
                  <div className="text-md mb-4 flex w-full max-w-md flex-col gap-2">
                    <div className="border-l-2 border-red-600 px-4 text-red-600">
                      {formError}
                    </div>
                  </div>
                )}
                <div
                  key="form"
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <form onSubmit={handleSubmit}>
                    <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                      Create your account
                    </h3>
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm text-dark dark:text-white"
                      >
                        Your Name
                      </label>
                      <input
                        type="name"
                        name="name"
                        placeholder="Enter your name"
                        required
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
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
                        required
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                    <div className="mb-8">
                      <label
                        htmlFor="password"
                        className="mb-3 block text-sm text-dark dark:text-white"
                      >
                        Your Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your Password"
                        required
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                    <div className="mb-8">
                      <label
                        htmlFor="checkboxLabel"
                        className="flex cursor-pointer select-none text-sm font-medium text-body-color"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="checkboxLabel"
                            className="sr-only"
                            required
                          />
                          <div className="box mr-4 mt-1 flex h-5 w-5 items-center justify-center rounded border border-body-color border-opacity-20 dark:border-white dark:border-opacity-10">
                            <span className="opacity-0">
                              <svg
                                width="11"
                                height="8"
                                viewBox="0 0 11 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                  fill="#3056D3"
                                  stroke="#3056D3"
                                  strokeWidth="0.4"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                        <span>
                          By creating an account you agree to the
                          <a href="#0" className="text-primary hover:underline">
                            {" "}
                            Terms and Conditions{" "}
                          </a>
                          , and our
                          <a href="#0" className="text-primary hover:underline">
                            {" "}
                            Privacy Policy{" "}
                          </a>
                        </span>
                      </label>
                    </div>
                    <div className="mb-6">
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                  <p className="text-center text-base font-medium text-body-color">
                    Already using Startup?{" "}
                    <Link
                      href="/signin"
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignupPage;
