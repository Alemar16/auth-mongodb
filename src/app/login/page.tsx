"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      window.alert(res.error);
      setError(res.error as string);
      return;
    }

    if (res?.ok) return router.push("/dashboard/profile");

    console.log(res);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>

        <label>Email:</label>
        <input
          type="email"
          placeholder="Email"
          className="bg-zinc-800 px-4 py-2 block mb-2"
          name="email"
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          className="bg-zinc-800 px-4 py-2 block mb-2"
          name="password"
        />

        <button className="bg-blue-500 text-white px-4 py-2">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
