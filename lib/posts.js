import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDir = path.join(process.cwd(), 'content', 'posts');

export async function getAllPostsMeta(){
  const files = fs.readdirSync(postsDir).filter(f=>f.endsWith('.md'));
  const posts = files.map(file=>{
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { data } = matter(raw);
    return { slug, ...data };
  }).sort((a,b)=> new Date(b.date) - new Date(a.date));
  return posts;
}

export async function getPostBySlug(slug){
  const file = path.join(postsDir, slug + '.md');
  if(!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  return { slug, ...data, html: processed.toString() };
}