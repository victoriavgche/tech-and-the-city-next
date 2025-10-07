import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDir = path.join(process.cwd(), 'content', 'posts');

export async function getAllPostsMeta(){
  try {
    const files = fs.readdirSync(postsDir).filter(f=>f.endsWith('.md'));
    const posts = files.map(file=>{
      try {
        const slug = file.replace(/\.md$/, '');
        const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const { data, content } = matter(raw);
        return { slug, ...data, body: content };
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        return null;
      }
    }).filter(Boolean).sort((a,b)=> new Date(b.date) - new Date(a.date));
    return posts;
  } catch (error) {
    console.error('Error in getAllPostsMeta:', error);
    return [];
  }
}

export async function getPublishedPosts(){
  try {
    const allPosts = await getAllPostsMeta();
    return allPosts.filter(post => post.status !== 'draft');
  } catch (error) {
    console.error('Error in getPublishedPosts:', error);
    return [];
  }
}

export async function getPublishedPostsMeta(){
  try {
    const allPosts = await getAllPostsMeta();
    return allPosts.filter(post => post.status !== 'draft');
  } catch (error) {
    console.error('Error in getPublishedPostsMeta:', error);
    return [];
  }
}

export async function getDraftPosts(){
  try {
    const allPosts = await getAllPostsMeta();
    return allPosts.filter(post => post.status === 'draft');
  } catch (error) {
    console.error('Error in getDraftPosts:', error);
    return [];
  }
}

export async function getPostBySlug(slug){
  try {
    const file = path.join(postsDir, slug + '.md');
    if(!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    
    // Check if content is already HTML (contains HTML tags)
    const isHTML = /<[^>]*>/g.test(content);
    
    let processedContent;
    if (isHTML) {
      // Content is already HTML, use it directly
      processedContent = content;
    } else {
      // Process markdown to HTML
      try {
        const result = await remark()
          .use(html)
          .process(content);
        processedContent = String(result);
      } catch (markdownError) {
        console.error('Error processing markdown:', markdownError);
        // Fallback: wrap content in paragraph tags with proper spacing
        processedContent = `<p>${content.replace(/\n\n/g, '</p>\n\n<p>').replace(/\n/g, '<br>')}</p>`;
      }
    }
    
    return { 
      slug, 
      ...data, 
      body: content, 
      content: processedContent 
    };
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    return null;
  }
}