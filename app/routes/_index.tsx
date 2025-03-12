import type { Route } from "./+types/_index";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const res = await fetch('http://localhost:3000/why');
  const resdata = await fetch('http://localhost:3000/data');

  if (!res.ok) throw new Response("Failed to fetch", { status: res.status });
  
  const hello = await res.json();
  const data = await resdata.json();
  console.log(data);

  return { message: hello.server_data, data: data.server_data };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} data={loaderData.data} />;
}
