/* ============================================================
   Your Heart — Data Layer
   A tiny localStorage-backed "database" shared by every page
   and the admin panel, so they all read/write the same data.

   NOTE ON A REAL BACKEND: every function below reads/writes
   localStorage. To connect a real server later, replace the
   body of each function with a fetch() call to your API — the
   function names/shapes (db.list, db.get, db.create, db.update,
   db.remove) are written so no other file has to change.
   ============================================================ */

const DB_PREFIX = "yourheart_";

const Store = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(DB_PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.error("Store read failed:", key, e);
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(DB_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Store write failed:", key, e);
      return false;
    }
  },
};

function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/* ---------------- Seed data (only written once) ---------------- */

const SEED = {
  doctors: [
    {
      id: "doc_1",
      name: "Dr. Robert Grayson",
      title: "Chief Cardiothoracic Surgeon",
      specialty: "Bypass & Valve Surgery",
      bio: "Dr. Grayson leads the surgical team at Your Heart with over 18 years of experience in coronary bypass and valve repair, and has performed more than 3,000 cardiac procedures.",
      experience: "18+ years",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80",
    },
    {
      id: "doc_2",
      name: "Dr. Elena Marsh",
      title: "Interventional Cardiologist",
      specialty: "Angiography & Stenting",
      bio: "Dr. Marsh specializes in minimally invasive catheter procedures, guiding patients through diagnosis and treatment with a calm, thorough approach.",
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80",
    },
    {
      id: "doc_3",
      name: "Dr. Samuel Okoye",
      title: "Cardiac Anesthesiologist",
      specialty: "Perioperative Care",
      bio: "Dr. Okoye oversees anesthesia and patient safety throughout every surgical procedure, working closely with the surgical and nursing teams.",
      experience: "10 years",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80",
    },
    {
      id: "doc_4",
      name: "Dr. Nadia Farooq",
      title: "Cardiac Rehabilitation Lead",
      specialty: "Post-Surgery Recovery",
      bio: "Dr. Farooq designs personalized recovery programs that help patients rebuild strength and confidence after surgery.",
      experience: "9 years",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80",
    },
  ],
  equipment: [
    {
      id: "eq_1",
      name: "Cardiopulmonary Bypass Machine",
      category: "Surgical",
      description: "Temporarily takes over heart and lung function during open-heart surgery, keeping blood oxygenated and circulating.",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
    },
    {
      id: "eq_2",
      name: "Angiography Machine",
      category: "Diagnostic",
      description: "Live X-ray imaging of blood vessels used to locate blockages and guide catheter-based procedures with precision.",
      image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80",
    },
    {
      id: "eq_3",
      name: "12-Lead ECG Machine",
      category: "Diagnostic",
      description: "Records the heart's electrical activity to detect arrhythmias, ischemia and other cardiac abnormalities in minutes.",
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80",
    },
    {
      id: "eq_4",
      name: "ICU Ventilator",
      category: "Critical Care",
      description: "Supports breathing for patients recovering from major cardiac surgery, with continuous monitoring built in.",
      image: "https://images.unsplash.com/photo-1584431913415-3c94dda1f4a2?w=800&q=80",
    },
    {
      id: "eq_5",
      name: "Echocardiography Unit",
      category: "Diagnostic",
      description: "Ultrasound imaging of the heart's chambers and valves, used for both diagnosis and ongoing monitoring.",
      image: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=800&q=80",
    },
    {
      id: "eq_6",
      name: "Dialysis Machine",
      category: "Critical Care",
      description: "Filters blood for patients with kidney complications following surgery, supporting full-body recovery.",
      image: "https://images.unsplash.com/photo-1631563018926-75a34a5be7a6?w=800&q=80",
    },
  ],
  posts: [
    {
      id: "post_1",
      title: "What to expect before bypass surgery",
      excerpt: "A plain-language walkthrough of pre-operative tests, fasting rules, and how to prepare mentally for the day.",
      body: "Bypass surgery can feel overwhelming to prepare for, but most of the process follows a predictable schedule. In the two weeks before surgery you'll have blood work, an ECG and an echocardiogram to confirm you're ready. The night before, you'll be asked to fast from midnight and shower with an antiseptic wash. On the day itself, the surgical team walks you through anesthesia, expected time in the operating room, and what the first 24 hours in recovery typically look like. Most patients spend one to two days in intensive care before moving to a standard recovery ward.",
      author: "Dr. Robert Grayson",
      category: "Surgery",
      date: "2026-05-12",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80",
    },
    {
      id: "post_2",
      title: "Reading your angiogram results",
      excerpt: "Understanding blockage percentages, stent recommendations, and what questions to ask your cardiologist.",
      body: "An angiogram report can look like a wall of numbers and abbreviations. The most important figure is usually the blockage percentage in each artery — anything above 70% is typically considered significant. Your cardiologist will explain whether the recommended next step is medication, a stent, or bypass surgery, based on how many vessels are affected and where. This article breaks down common terms you'll see on the report and a short list of questions worth asking at your follow-up appointment.",
      author: "Dr. Elena Marsh",
      category: "Diagnostics",
      date: "2026-04-20",
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80",
    },
    {
      id: "post_3",
      title: "Cardiac rehab: the first six weeks",
      excerpt: "A week-by-week look at what recovery actually involves after heart surgery.",
      body: "Cardiac rehabilitation typically begins two to three weeks after surgery, once your surgeon confirms you're ready. The first two weeks focus on short supervised walks and breathing exercises. By week four, most patients are doing light supervised cardio and basic strength work. By week six, many are back to most daily activities, with driving and light work often cleared around this point too, depending on individual recovery. Every plan is personalized, so timelines can shift based on your specific procedure and progress.",
      author: "Dr. Nadia Farooq",
      category: "Recovery",
      date: "2026-03-15",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    },
  ],
  plans: [
    {
      id: "plan_1",
      name: "Consultation Care",
      price: 49,
      period: "visit",
      description: "A thorough first consultation with diagnostic review.",
      features: ["45-minute consultation", "ECG screening", "Personalized care plan", "Follow-up call within a week"],
      popular: false,
    },
    {
      id: "plan_2",
      name: "Diagnostic Package",
      price: 199,
      period: "visit",
      description: "Full diagnostic workup for a clear picture of heart health.",
      features: ["Everything in Consultation Care", "Echocardiogram", "Angiography review", "Specialist referral if needed"],
      popular: true,
    },
    {
      id: "plan_3",
      name: "Surgical & Recovery",
      price: 899,
      period: "package",
      description: "End-to-end coordination for surgery and rehabilitation.",
      features: ["Everything in Diagnostic Package", "Pre-surgical planning", "6-week rehab program", "Dedicated care coordinator"],
      popular: false,
    },
  ],
  testimonials: [
    {
      id: "test_1",
      name: "Harold Bennett",
      role: "Bypass surgery patient",
      quote: "Dr. Grayson and the team explained every step before surgery. I never felt rushed or in the dark.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    {
      id: "test_2",
      name: "Farida Khan",
      role: "Angiography patient",
      quote: "The angiography was quick and Dr. Marsh walked me through the results the same day. Great communication throughout.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    },
    {
      id: "test_3",
      name: "Michael Torres",
      role: "Cardiac rehab graduate",
      quote: "Six weeks of rehab with Dr. Farooq's team got me back to my normal routine faster than I expected.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    },
  ],
  appointments: [],
  messages: [],
  users: [
    { id: "user_1", name: "Clinic Admin", email: "admin@yourheart.clinic", role: "admin", joined: "2026-01-10" },
  ],
};

function ensureSeeded() {
  Object.entries(SEED).forEach(([key, value]) => {
    if (Store.read(key, null) === null) {
      Store.write(key, value);
    }
  });
}
ensureSeeded();

/* ---------------- Generic collection helpers ---------------- */

function makeCollection(key) {
  return {
    list() {
      return Store.read(key, []);
    },
    get(id) {
      return this.list().find((item) => item.id === id) || null;
    },
    create(data) {
      const items = this.list();
      const item = { id: uid(key.slice(0, 4)), ...data };
      items.unshift(item);
      Store.write(key, items);
      return item;
    },
    update(id, patch) {
      const items = this.list().map((item) => (item.id === id ? { ...item, ...patch } : item));
      Store.write(key, items);
      return this.get(id);
    },
    remove(id) {
      const items = this.list().filter((item) => item.id !== id);
      Store.write(key, items);
    },
  };
}

const db = {
  doctors: makeCollection("doctors"),
  equipment: makeCollection("equipment"),
  posts: makeCollection("posts"),
  plans: makeCollection("plans"),
  testimonials: makeCollection("testimonials"),
  appointments: makeCollection("appointments"),
  messages: makeCollection("messages"),
  users: makeCollection("users"),
  resetAll() {
    Object.keys(SEED).forEach((key) => localStorage.removeItem(DB_PREFIX + key));
    ensureSeeded();
  },
};
