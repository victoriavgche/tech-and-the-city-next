import Link from "next/link";
import { getAllPostsMeta } from "../../../lib/posts";

export const metadata = { title: "Articles — Tech & the City" };

export default async function Articles(){
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-semibold mb-4">Articles</h1>
      <div className="text-center py-8">
        <p className="text-gray-600">Articles page is being updated. Please check back later.</p>
      </div>
    </main>
  )
}