

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string; // Excerpt
  readTime?: string;
  date?: string;
  content: string; // HTML string or plain text for now
  type: 'guide' | 'blog';
  relatedToolRoute?: string;
}

export const GUIDES: ContentItem[] = [
  {
    id: 'g1',
    title: "How to Merge PDFs",
    slug: "merge-pdfs",
    category: "PDF Basics",
    description: "Learn how to combine multiple PDF documents into a single file easily and securely.",
    readTime: "3 min read",
    type: "guide",
    relatedToolRoute: "/tools/merge-pdf",
    content: `
      <p>Whether you are organizing invoices, submitting an assignment, or compiling a report, merging PDF files is a common necessity. With modern browser technologies, you no longer need to upload your sensitive documents to a remote server.</p>

      <h2>Step-by-Step Guide</h2>
      <ol>
        <li><strong>Select your files:</strong> Navigate to the Merge PDF tool. You can drag and drop multiple PDF files directly into the workspace or click to browse your computer.</li>
        <li><strong>Arrange the order:</strong> Once uploaded, you will see a list of your files. Use the up and down arrows to rearrange the documents into the exact order you want them to appear in the final merged PDF.</li>
        <li><strong>Merge and Download:</strong> Click the "Merge PDFs" button. The tool will process the files instantly in your browser. Once complete, click Download to save your new combined file.</li>
      </ol>
    `
  },
  {
    id: 'g2',
    title: "How to Compress Images without Losing Quality",
    slug: "compress-images",
    category: "Image Optimization",
    description: "Discover the best techniques to reduce image file sizes for the web while maintaining visual fidelity.",
    readTime: "5 min read",
    type: "guide",
    content: `
      <p>Large image files can slow down your website and consume unnecessary storage space. Learning how to compress them properly is essential for modern web workflows.</p>

      <h2>Understanding Image Compression</h2>
      <p>There are two main types of compression: Lossy (which discards some data to achieve smaller sizes) and Lossless (which preserves all original data).</p>

      <h2>Best Practices</h2>
      <ul>
        <li>Choose the right format: Use JPEG for photographs, PNG for graphics with transparency, and WebP for modern web delivery.</li>
        <li>Resize before compressing: Don't upload a 4K image if it will only be displayed at 800px wide.</li>
      </ul>
    `
  },
  {
    id: 'g3',
    title: "Calculating Percentages: A Complete Guide",
    slug: "calculate-percentage",
    category: "Math & Finance",
    description: "A quick refresher on calculating percentages, increases, decreases, and differences.",
    readTime: "4 min read",
    type: "guide",
    relatedToolRoute: "/calculators/percentage",
    content: `
      <p>Percentages are everywhere, from calculating tips to understanding interest rates. This guide provides a simple refresher on how to calculate them.</p>

      <h2>The Basic Formula</h2>
      <p>Percentage = (Part / Whole) x 100</p>

      <h2>Calculating Discounts</h2>
      <p>To find the final price after a discount, multiply the original price by the discount percentage (e.g., 0.20 for 20%), then subtract that amount from the original price.</p>
    `
  }
];

export const BLOG_POSTS: ContentItem[] = [
  {
    id: 'b1',
    title: "10 Best Free AI Tools for Students in 2024",
    slug: "best-free-ai-tools",
    category: "AI Tools",
    description: "A curated list of free AI utilities that can help streamline your study workflow.",
    readTime: "6 min read",
    date: "Oct 24, 2024",
    type: "blog",
    relatedToolRoute: "/tools/split-pdf",
    content: `
      <p>Artificial intelligence is rapidly transforming how students approach research, writing, and studying. From generating summaries of dense academic papers to helping organize schedules, AI tools have become indispensable.</p>
      <p>However, with so many premium subscriptions out there, it can be hard to find high-quality tools that won't break a student budget. Here is our curated list of the best completely free AI utilities available right now.</p>

      <h2>1. Document and Research Assistants</h2>
      <p>One of the most time-consuming aspects of university life is parsing through hundreds of pages of PDFs. While AI can help summarize these, you often need to extract, merge, or compress these documents first before feeding them into LLMs.</p>

      <h2>2. AI Note-Taking Apps</h2>
      <p>Tools like Notion AI and Obsidian offer incredible ways to connect your thoughts. Many of them offer robust free tiers tailored specifically for students with active .edu email addresses.</p>

      <h2>Conclusion</h2>
      <p>Incorporating these tools into your daily workflow can save you dozens of hours a semester. Just remember that AI is an assistant, not a replacement for actual learning and critical thinking.</p>
    `
  },
  {
    id: 'b2',
    title: "Mastering Productivity: The Pomodoro Technique",
    slug: "pomodoro-technique",
    category: "Productivity",
    description: "How breaking your work into 25-minute intervals can dramatically improve focus.",
    readTime: "4 min read",
    date: "Oct 20, 2024",
    type: "blog",
    content: `
      <p>The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks.</p>

      <h2>How it Works</h2>
      <ol>
        <li>Decide on the task to be done.</li>
        <li>Set the pomodoro timer (traditionally to 25 minutes).</li>
        <li>Work on the task.</li>
        <li>End work when the timer rings and take a short break (typically 5–10 minutes).</li>
        <li>After four pomodoros, take a longer break (typically 20 to 30 minutes).</li>
      </ol>

      <p>This technique is effective because it instills a sense of urgency while also preventing burnout by mandating regular breaks.</p>
    `
  }
];

export const getGuideBySlug = (slug: string) => GUIDES.find(g => g.slug === slug);
export const getBlogPostBySlug = (slug: string) => BLOG_POSTS.find(b => b.slug === slug);
