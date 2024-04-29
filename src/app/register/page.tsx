"use client";

import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const [error, setError] = useState();
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const signupResponse = await axios.post("/api/auth/signup", {
        fullname: formData.get("fullname"),
        email: formData.get("email"),
        password: formData.get("password"),
      });
      console.log(signupResponse);

      const res = await signIn("credentials", {
        email: signupResponse.data.email,
        password: formData.get("password"),
        redirect: false,
      });

      if (res?.ok) return router.push("/dashboard");

      console.log(res);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        // Mostrar una alerta con el mensaje de error
        window.alert(error.response?.data.message);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Signup</h1>

        <label>Fullname:</label>
        <input
          type="text"
          placeholder="Fullname"
          className="bg-zinc-800 px-4 py-2 block mb-2"
          name="fullname"
        />

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

        <button className="bg-blue-500 text-white px-4 py-2">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
