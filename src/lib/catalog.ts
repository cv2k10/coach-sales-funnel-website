export const COACH = {
  name: "Maya Brooks",
  brand: "Elevate Academy",
  title: "Online Business & Coaching Mentor",
  email: "hello@elevate-academy.com",
};

export type Product = {
  sku: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // cents
  compareAt?: number;
  kind: "course" | "tripwire" | "bump" | "upsell" | "downsell";
  image?: string;
  plan?: { installments: number; amount: number };
  modules?: { title: string; lessons: number; desc: string }[];
  bullets?: string[];
  badge?: string;
};

export const PRODUCTS: Product[] = [
  {
    sku: "accelerator",
    slug: "coach-accelerator",
    name: "Online Coach Accelerator",
    tagline: "The complete system to sign 10+ high-ticket clients in 90 days.",
    description:
      "My flagship program. Everything I used to grow from zero to a 7-figure coaching business: positioning, offer creation, content, funnels, sales calls and delivery.",
    price: 49700,
    compareAt: 99700,
    kind: "course",
    image: "/images/course-accelerator.jpg",
    badge: "Best Seller",
    plan: { installments: 3, amount: 17700 },
    modules: [
      { title: "Irresistible Positioning", lessons: 6, desc: "Pick a niche that pays and craft a magnetic message." },
      { title: "The High-Ticket Offer", lessons: 7, desc: "Package your expertise into a $2k–$5k transformation." },
      { title: "Content That Converts", lessons: 8, desc: "A 30-min/day content engine that attracts buyers." },
      { title: "Automated Funnels", lessons: 9, desc: "Lead magnets, email sequences and webinars on autopilot." },
      { title: "Sales Calls Mastery", lessons: 6, desc: "My 5-step call script with a 40%+ close rate." },
      { title: "Scale & Delivery", lessons: 5, desc: "Group programs, systems and hiring your first VA." },
    ],
    bullets: [
      "41 step-by-step video lessons",
      "Funnel & email swipe files",
      "Private community access",
      "Monthly live Q&A calls",
      "Lifetime access + updates",
    ],
  },
  {
    sku: "content",
    slug: "content-to-clients",
    name: "Content to Clients",
    tagline: "Turn social media posts into a steady stream of booked calls.",
    description:
      "A focused course on building an audience that buys. Learn the hooks, formats and DM strategies that turn followers into paying clients.",
    price: 29700,
    compareAt: 49700,
    kind: "course",
    image: "/images/course-content.jpg",
    modules: [
      { title: "Audience Psychology", lessons: 4, desc: "Understand what makes your ideal client stop scrolling." },
      { title: "100 Viral Hooks", lessons: 5, desc: "Proven openers for posts, reels and emails." },
      { title: "The DM Playbook", lessons: 5, desc: "Start conversations that end in a booked call." },
      { title: "Content Calendar", lessons: 3, desc: "Plan a month of content in a single afternoon." },
    ],
    bullets: ["17 video lessons", "Hook & caption library", "DM scripts", "Lifetime access"],
  },
  {
    sku: "launch",
    slug: "launch-lab",
    name: "Launch Lab",
    tagline: "Launch your first digital course in 30 days — even with a small audience.",
    description:
      "From idea validation to your first 50 students. A sprint-style program with daily action steps and launch templates.",
    price: 19700,
    compareAt: 39700,
    kind: "course",
    image: "/images/course-launch.jpg",
    modules: [
      { title: "Validate Your Idea", lessons: 3, desc: "Pre-sell before you build." },
      { title: "Build Lean", lessons: 4, desc: "Create the course fast with simple tools." },
      { title: "Launch Week", lessons: 5, desc: "Day-by-day launch plan with email templates." },
    ],
    bullets: ["12 video lessons", "Launch email templates", "30-day action plan", "Lifetime access"],
  },
  {
    sku: "mini",
    slug: "client-magnet-mini",
    name: "7-Day Client Magnet Mini-Course",
    tagline: "Land your first (or next) paying client in 7 days.",
    description: "A fast-action mini-course with one 15-minute lesson per day.",
    price: 700,
    compareAt: 4700,
    kind: "tripwire",
    image: "/images/course-content.jpg",
    modules: [{ title: "7 Daily Lessons", lessons: 7, desc: "One 15-minute action lesson per day." }],
    bullets: ["7 short daily lessons", "Outreach templates", "Client tracker sheet"],
  },
  {
    sku: "vault",
    slug: "template-vault",
    name: "Done-For-You Template Vault",
    tagline: "50+ plug-and-play templates: emails, sales pages, contracts & scripts.",
    description: "Save 100+ hours with the exact templates I use in my business.",
    price: 2700,
    compareAt: 9700,
    kind: "bump",
  },
  {
    sku: "vip",
    slug: "vip-coaching",
    name: "VIP Group Coaching (3 Months)",
    tagline: "Weekly live coaching with Maya + hot-seat reviews of your funnel.",
    description:
      "Get direct feedback, accountability and personalized strategy every week for 12 weeks.",
    price: 99700,
    compareAt: 199700,
    kind: "upsell",
    bullets: ["12 weekly live group calls", "Funnel & offer hot-seats", "Private VIP chat", "Accountability partner"],
  },
  {
    sku: "replays",
    slug: "coaching-replays",
    name: "Coaching Replay Library",
    tagline: "Access 50+ recorded coaching sessions and monthly Q&A.",
    description: "Learn from real coaching calls with students just like you.",
    price: 19700,
    compareAt: 49700,
    kind: "downsell",
    bullets: ["50+ recorded hot-seats", "Searchable by topic", "Monthly live Q&A"],
  },
];

export const COURSES = PRODUCTS.filter((p) => p.kind === "course");
export const getProduct = (sku: string) => PRODUCTS.find((p) => p.sku === sku);
export const getProductBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const money = (cents: number) =>
  "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: cents % 100 ? 2 : 0 });

export const TESTIMONIALS = [
  { name: "Jessica R.", role: "Life Coach", quote: "I went from 2 clients to a fully booked calendar in 9 weeks. The funnel module alone paid for the program 20x.", result: "$18k/mo" },
  { name: "Daniel K.", role: "Fitness Coach", quote: "Maya's sales call framework is gold. My close rate jumped from 15% to 45% in the first month.", result: "45% close rate" },
  { name: "Priya S.", role: "Career Coach", quote: "I finally launched my group program. 32 students on the first launch with an email list of only 600.", result: "32 students" },
  { name: "Marcus T.", role: "Business Coach", quote: "The automation templates saved me months. My webinar funnel now runs 24/7 while I focus on clients.", result: "$62k launch" },
  { name: "Elena V.", role: "Mindset Coach", quote: "Clear, practical, no fluff. I quit my 9-5 four months after joining the Accelerator.", result: "Quit 9-5" },
  { name: "Tom W.", role: "Nutrition Coach", quote: "Best investment I've made. The community and live Q&As keep me accountable every week.", result: "3x revenue" },
];

export const FAQS = [
  { q: "Do I need a big audience to succeed?", a: "No. Most of my students start with fewer than 1,000 followers. The system is designed to convert small, engaged audiences into paying clients." },
  { q: "How long do I have access?", a: "Lifetime access, including all future updates to the course material." },
  { q: "Is there a guarantee?", a: "Yes — a 30-day 'Do The Work' money-back guarantee. Complete the first 3 modules and if you don't see value, I'll refund every penny." },
  { q: "Can I pay in installments?", a: "Yes. The Online Coach Accelerator offers a 3-payment plan at checkout." },
  { q: "What if I'm not sure which course is right for me?", a: "Book a free strategy call and we'll map out the best path for where you are right now." },
];
