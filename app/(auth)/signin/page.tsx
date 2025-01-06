"use client";

import SignIn from "@/app/(auth)/signin/SignIn";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <SignIn />
      </div>
    </div>
  );
}
