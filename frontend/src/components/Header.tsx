"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between p-4 bg-gray-800 text-white">
      <Link href="/">
      <h1>MiMapa</h1>
      </Link>
      {session ? (
        <div>
          <span>Hola, {session.user?.email}</span>
          <button onClick={() => signOut()} className="ml-4">Cerrar sesión</button>
        </div>
      ) : (
        <button onClick={() => signIn("google")}>Iniciar sesión con Google</button>
      )}
    </header>
  );
}
