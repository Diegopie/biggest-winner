import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const res = await fetch('http://localhost:3000/why');

  if (!res.ok) throw new Response("Failed to fetch", { status: res.status });
  
  const {server_data} = await res.json();

  return { message: server_data };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />;
}
