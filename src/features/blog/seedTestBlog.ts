/**
 * One-off seed for testing the redesigned blog.
 *
 *   import { seedTestBlog, removeTestBlogs } from "@/features/blog/seedTestBlog";
 *   // then, from a button in the admin or the browser console:
 *   await seedTestBlog();
 *
 * Writes a published article that uses every block type, so you can check
 * rendering, reordering, captions, floats and galleries in one pass.
 * `removeTestBlogs()` deletes anything it created (slug prefix `test-`).
 */

import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { createBlog } from "./blogService";
import type { BlogFormValues, ContentBlock } from "./types";

/** Placeholder images. Stable URLs, real dimensions, no upload needed. */
const img = (seed: string, w = 1200, h = 800) =>
    `https://picsum.photos/seed/${seed}/${w}/${h}`;

const blocks: ContentBlock[] = [
    {
        id: "t01",
        type: "paragraph",
        lead: true,
        text: "Three years ago the E-Cell office was a borrowed desk and a whiteboard nobody wanted. This week it signed off on its fortieth incubated venture — and the founders behind them are getting younger every year.",
    },
    {
        id: "t02",
        type: "paragraph",
        text: 'The shift did not happen at a demo day. It happened in the unglamorous middle: office hours nobody photographed, a shared spreadsheet of failed pitches, and a rule that any second-year could <strong>book fifteen minutes</strong> with a mentor without asking permission. Read more about the <a href="/blog">rest of the programme</a>.',
    },
    {
        id: "t03",
        type: "heading",
        level: 2,
        text: "The room where it started",
    },
    {
        id: "t04",
        type: "image",
        url: img("ecell-room", 1600, 1000),
        alt: "Students working around a long table in a bright studio space",
        caption:
            "The incubation floor on a Tuesday evening. Full-width block — this should break out of the reading column on desktop.",
        align: "full",
    },
    {
        id: "t05",
        type: "paragraph",
        text: "Attendance was the first metric anyone tracked, mostly because it was the only one available. It turned out to predict everything else: teams that showed up on Tuesdays shipped, and teams that did not, did not.",
    },
    {
        id: "t06",
        type: "image",
        url: img("ecell-portrait", 800, 1000),
        alt: "A student founder presenting to a small group",
        caption:
            "Floated left — body text should wrap around this on desktop and stack full-width under 768px.",
        align: "left",
    },
    {
        id: "t07",
        type: "paragraph",
        text: "That informality had a cost. Without a record of who advised whom, the same mistakes surfaced every semester, and the same three mentors absorbed most of the load. The fix was boring and it worked: write it down, publish it, let the next cohort read it before they book.",
    },
    {
        id: "t08",
        type: "paragraph",
        text: "By the second year, the waiting list was longer than the programme. By the third, teams were turning up with a working prototype already in hand — which changed what office hours were even for.",
    },
    {
        id: "t09",
        type: "quote",
        variant: "pull",
        text: "We stopped asking students what they wanted to build and started asking what they had already built badly.",
        attribution: "Programme lead, E-Cell IPS Academy",
    },
    {
        id: "t10",
        type: "heading",
        level: 3,
        text: "What actually changed",
    },
    {
        id: "t11",
        type: "list",
        style: "numbered",
        items: [
            "Office hours moved from invite-only to open booking.",
            "Every session ended with a written note filed in a shared archive.",
            "Mentors rotated each term, so no single person became the bottleneck.",
            "Failed pitches were published alongside funded ones.",
        ],
    },
    {
        id: "t12",
        type: "paragraph",
        text: "None of it required a budget line. Most of it required someone willing to keep a document up to date for four consecutive semesters, which turns out to be the harder ask.",
    },
    { id: "t13", type: "divider" },
    {
        id: "t14",
        type: "heading",
        level: 2,
        text: "The current cohort",
    },
    {
        id: "t15",
        type: "gallery",
        columns: 3,
        caption:
            "Three-column gallery. Should collapse to two columns on narrow screens.",
        images: [
            { url: img("cohort-a", 900, 700), alt: "Team reviewing a prototype", caption: "Hardware team, week four" },
            { url: img("cohort-b", 900, 700), alt: "Whiteboard covered in diagrams", caption: "Pricing, argued about" },
            { url: img("cohort-c", 900, 700), alt: "Two students at a laptop", caption: "Shipping on a deadline" },
        ],
    },
    {
        id: "t16",
        type: "paragraph",
        text: "Eleven teams are in the building this term. Four have paying customers, two have quietly stopped, and the rest are somewhere in the middle — which is roughly the ratio the programme has held since it started measuring.",
    },
    {
        id: "t17",
        type: "quote",
        variant: "block",
        text: "An inline block quote, set smaller than a pull quote and used for source material rather than emphasis.",
        attribution: "Annual report, 2025",
    },
    {
        id: "t18",
        type: "heading",
        level: 4,
        text: "A minor heading, set in the UI sans",
    },
    {
        id: "t19",
        type: "list",
        style: "bulleted",
        items: [
            "Applications open at the start of each term.",
            "No equity is taken at any stage.",
            "Alumni mentors join remotely on Thursdays.",
        ],
    },
    {
        id: "t20",
        type: "image",
        url: img("ecell-inset", 1000, 700),
        alt: "Empty studio at night",
        caption: "Centred, inset block — narrower than the reading column.",
        align: "center",
    },
    {
        id: "t21",
        type: "paragraph",
        text: "Whether any of this survives the next handover is an open question. The archive is the bet: if the notes outlast the people who wrote them, the programme keeps its memory.",
    },
];

const post: BlogFormValues = {
    title: "The quiet years that built a startup pipeline",
    subtitle:
        "Forty ventures later, the E-Cell's most important decision was writing things down.",
    slug: "test-the-quiet-years",
    excerpt:
        "No demo day, no budget line — just open office hours and a shared archive that outlasted the students who started it.",
    blocks,
    content: "",
    featuredImage: img("ecell-cover", 1800, 1100),
    featuredImagePublicId: "",
    featuredImageCaption:
        "The incubation floor, photographed for the annual report.",
    status: "published",
    category: "E-Cell Updates",
    tags: ["incubation", "campus", "mentorship"],
    author: {
        name: "Arib",
        email: "desk@ipsacademy.org",
        bio: "Writes about the campus startup programme and the people passing through it.",
        avatar: img("author", 200, 200),
    },
    publishedDate: new Date().toISOString().slice(0, 10),
    seoTitle: "How E-Cell IPS Academy built a startup pipeline",
    seoDescription:
        "Forty incubated ventures, no budget line, and one shared archive. Inside the E-Cell's quiet years.",
    isFeature: true,
    viewCount: 1284,
};

/** A short second post, so the grid and sidebar have something to arrange. */
const shortPost: BlogFormValues = {
    ...post,
    title: "Applications open for the spring cohort",
    subtitle: "Eleven places, no equity taken, applications close on the 30th.",
    slug: "test-spring-cohort-applications",
    excerpt:
        "The spring intake is open to any enrolled student with a prototype, however rough.",
    featuredImage: img("cohort-notice", 1400, 900),
    featuredImageCaption: "",
    category: "Startups",
    tags: ["applications", "campus"],
    isFeature: false,
    viewCount: 312,
    blocks: [
        {
            id: "s01",
            type: "paragraph",
            lead: true,
            text: "Applications for the spring cohort are open until the thirtieth. Eleven places, no equity taken, open to any enrolled student.",
        },
        {
            id: "s02",
            type: "image",
            url: img("cohort-notice-body", 1400, 900),
            alt: "Noticeboard in a university corridor",
            caption: "Applications are also posted on the second-floor board.",
            align: "full",
        },
        {
            id: "s03",
            type: "paragraph",
            text: "Bring something you have already built, even if it barely works. Teams arriving with a prototype get further in the first month than teams arriving with a deck.",
        },
    ],
};

export async function seedTestBlog(): Promise<void> {
    await createBlog(post);
    await createBlog(shortPost);
}

/** Deletes every post whose slug starts with `test-`. */
export async function removeTestBlogs(): Promise<number> {
    const snap = await getDocs(
        query(
            collection(db, "blogs"),
            where("slug", ">=", "test-"),
            where("slug", "<=", "test-\uf8ff")
        )
    );
    await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "blogs", d.id))));
    return snap.size;
}