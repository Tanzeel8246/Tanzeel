import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const blog = await prisma.blog.upsert({
    where: { slug: 'welcome-to-our-tools' },
    update: {},
    create: {
      title: 'Welcome to Our New Tools Platform',
      slug: 'welcome-to-our-tools',
      excerpt: 'We are excited to launch our new suite of online tools including PDF and Image utilities.',
      seoTitle: 'Welcome to Our Online Tools | Fast & Secure',
      seoDesc: 'Discover the best online tools for managing your PDFs, converting images, and much more.',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
      published: true,
      content: `
# Welcome to the new era of online tools!

We have spent months building the most robust, fast, and secure tools engine for your daily tasks. 

## What can you do here?

- **Merge PDFs**: Combine multiple documents easily.
- **Split PDFs**: Extract that one important page.
- **Resize Images**: Scale your pictures for social media.
- **Convert Formats**: Switch from PNG to WebP for better SEO!

### Why choose us?

Unlike other platforms, we run entirely on optimized background jobs meaning your files are processed securely and swiftly. We don't keep your files forever!

Enjoy exploring our tools!
      `,
    },
  });

  console.log('Seeded blog:', blog.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
