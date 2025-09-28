import { getPublishedPosts } from "../lib/posts";
import HomePageClient from "../components/HomePageClient";

export default async function Home(){
  const posts = await getPublishedPosts();
  
  return <HomePageClient posts={posts} />;
}