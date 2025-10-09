import { getPublishedArticles } from "../lib/articles";
import HomePageClient from "../components/HomePageClient";

export default async function Home(){
  const posts = await getPublishedArticles();
  
  return <HomePageClient posts={posts} />;
}