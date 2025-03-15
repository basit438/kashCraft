"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("Verifying your email...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token.");
      setIsLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => router.push("/login"), 3000); // Redirect to login after 3 sec
        } else {
          setMessage(`${data.message || "Verification failed"}`);
        }
      } catch (error) {
        setMessage("Server error. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Email Verification</h1>
      <p>{message}</p>
      {isLoading && <p>⏳ Please wait...</p>}
    </div>
  );
};

export default VerifyEmail;
