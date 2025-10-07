import connectDB from './database.js';
import Post from './models/Post.js';
import Event from './models/Event.js';
import fs from 'fs';
import path from 'path';

async function migrateData() {
  try {
    await connectDB();
    console.log('🔄 Starting data migration...');

    // Migrate posts
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    
    console.log(`📝 Found ${postFiles.length} posts to migrate`);
    
    for (const file of postFiles) {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Parse front matter
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!frontMatterMatch) continue;
      
      const frontMatter = frontMatterMatch[1];
      const body = frontMatterMatch[2];
      
      const metadata = {};
      frontMatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          metadata[key.trim()] = valueParts.join(':').trim().replace(/['"]/g, '');
        }
      });
      
      const slug = file.replace('.md', '');
      
      // Check if post already exists
      const existingPost = await Post.findOne({ slug });
      if (existingPost) {
        console.log(`⏭️ Post ${slug} already exists, skipping`);
        continue;
      }
      
      // Create new post
      const post = new Post({
        slug,
        title: metadata.title || '',
        excerpt: metadata.excerpt || '',
        content: body,
        date: metadata.date || new Date().toISOString().split('T')[0],
        image: metadata.image || '',
        status: metadata.status || 'published'
      });
      
      await post.save();
      console.log(`✅ Migrated post: ${slug}`);
    }

    // Migrate events
    const eventsPath = path.join(process.cwd(), 'data', 'events.json');
    if (fs.existsSync(eventsPath)) {
      const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
      
      console.log(`🎉 Found ${eventsData.length} events to migrate`);
      
      for (const eventData of eventsData) {
        // Check if event already exists
        const existingEvent = await Event.findOne({ id: eventData.id });
        if (existingEvent) {
          console.log(`⏭️ Event ${eventData.id} already exists, skipping`);
          continue;
        }
        
        // Create new event
        const event = new Event({
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          type: eventData.type,
          status: eventData.status || 'published'
        });
        
        await event.save();
        console.log(`✅ Migrated event: ${eventData.id}`);
      }
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  migrateData();
}

export default migrateData;
