"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  // This effect checks if a user is already logged in and redirects them
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
    };
    checkUser();

    // Listen for sign-in and redirect
    const { data: { subscription }, } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.push("/");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-card">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["github", "google"]}
          redirectTo="http://localhost:3000/auth/callback"
        />
      </div>
    </div>
  );
}
