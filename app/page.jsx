import { getAllPostsMeta } from "../lib/posts";
import HomePageClient from "../components/HomePageClient";

export default async function Home(){
  const posts = await getAllPostsMeta();
  
  return <HomePageClient posts={posts} />;
}