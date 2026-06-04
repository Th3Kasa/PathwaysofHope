// ─── Site photo section definitions ──────────────────────────────────────────
// Every manageable photo across the site. Keys are stored in admin config.json.
// Donation goal keys match KAPOETA_GOALS IDs and live in lib/goals.ts.

export interface SiteSection {
  key: string;
  label: string;
  page: string;
  defaultImage: string;
  aiPrompt: string;
}

export const HOME_SECTIONS: SiteSection[] = [
  {
    key: "home-hero",
    label: "Hero background",
    page: "Home",
    defaultImage: "/images/kapoeta/field/children-group-sunset-kapoeta.jpg",
    aiPrompt: "Photorealistic wide-angle sunset photo of African children standing together at golden hour in rural South Sudan, silhouettes, warm light, hopeful atmosphere, documentary photography",
  },
  {
    key: "home-strip-1",
    label: "Strip 1 – Children found",
    page: "Home",
    defaultImage: "/images/kapoeta/field/child-eating-bowl-rice-kapoeta.jpg",
    aiPrompt: "Photorealistic close-up of a young African child eating rice from a bowl, genuine candid expression, warm afternoon light, South Sudan, documentary style",
  },
  {
    key: "home-strip-2",
    label: "Strip 2 – Building",
    page: "Home",
    defaultImage: "/images/kapoeta/field/shelter-steel-frame-construction-kapoeta.jpg",
    aiPrompt: "Photorealistic documentary photo of a steel frame shelter under construction in rural South Sudan, warm natural light",
  },
  {
    key: "home-strip-3",
    label: "Strip 3 – Home",
    page: "Home",
    defaultImage: "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg",
    aiPrompt: "Photorealistic wide-angle photo of African children gathered together at a shelter compound in South Sudan, warm natural light, documentary style",
  },
  {
    key: "home-strip-4",
    label: "Strip 4 – Safe beds",
    page: "Home",
    defaultImage: "/images/kapoeta/field/community-hall-worship-service-kapoeta.jpg",
    aiPrompt: "Photorealistic documentary photo inside a community gathering hall in South Sudan, warm indoor light",
  },
  {
    key: "home-strip-5",
    label: "Strip 5 – School",
    page: "Home",
    defaultImage: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg",
    aiPrompt: "Photorealistic group photo of African children in school uniforms at a shelter in South Sudan, smiling, warm outdoor light, documentary photography",
  },
  {
    key: "home-strip-6",
    label: "Strip 6 – Teaching",
    page: "Home",
    defaultImage: "/images/kapoeta/field/visitor-woman-teaching-children-kapoeta.jpg",
    aiPrompt: "Photorealistic documentary photo of a woman volunteer teaching children at a children's shelter in South Sudan, genuine interaction, warm afternoon light",
  },
  {
    key: "home-strip-7",
    label: "Strip 7 – Partnership",
    page: "Home",
    defaultImage: "/images/people/mamdouh-mansour-children-kapoeta.jpg",
    aiPrompt: "Photorealistic documentary photo of an elder man warmly with African children at a shelter in South Sudan, genuine joyful moment, warm natural light",
  },
];

export const KAPOETA_SECTIONS: SiteSection[] = [
  {
    key: "kapoeta-hero",
    label: "Page hero",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg",
    aiPrompt: "Photorealistic wide-angle landscape photo of African children at a shelter compound in Kapoeta, South Sudan at golden hour, documentary photography",
  },
  {
    key: "kapoeta-chapter1",
    label: "Chapter 1 – The Calling",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/children-outdoor-activity-kapoeta.jpg",
    aiPrompt: "Photorealistic documentary photo of African children in an outdoor activity at a shelter compound in South Sudan, warm afternoon light, candid moment",
  },
  {
    key: "kapoeta-container-1",
    label: "Carousel 1 – Mattresses",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/container-contents-mattresses-materials.jpg",
    aiPrompt: "Photorealistic documentary photo of mattresses and materials packed in a shipping container for Africa, warm indoor light",
  },
  {
    key: "kapoeta-container-2",
    label: "Carousel 2 – Cooking pots",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/cooking-pots-donated-australia.jpg",
    aiPrompt: "Photorealistic photo of donated cooking pots and kitchen equipment packed for a children's shelter, documentary style",
  },
  {
    key: "kapoeta-container-3",
    label: "Carousel 3 – Food supplies",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/food-supplies-bags-rice-beans.jpg",
    aiPrompt: "Photorealistic photo of large bags of rice and beans stacked as food supplies for a children's shelter in South Sudan",
  },
  {
    key: "kapoeta-container-4",
    label: "Carousel 4 – Steel frame",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/shelter-steel-frame-construction-kapoeta.jpg",
    aiPrompt: "Photorealistic documentary photo of steel building frame being erected at a shelter in South Sudan, construction workers, warm light",
  },
  {
    key: "kapoeta-container-5",
    label: "Carousel 5 – Brick progress",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/shelter-brickwall-construction-progress.jpg",
    aiPrompt: "Photorealistic photo of brickwork construction in progress at a shelter in rural South Sudan, freshly laid walls, natural light",
  },
  {
    key: "kapoeta-container-6",
    label: "Carousel 6 – Walls meet frame",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/shelter-brickwall-steel-frame-kapoeta.jpg",
    aiPrompt: "Photorealistic documentary photo of brick walls and steel frame combined at a building under construction in South Sudan",
  },
  {
    key: "kapoeta-container-7",
    label: "Carousel 7 – Exterior",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/shelter-steel-frame-exterior-kapoeta.jpg",
    aiPrompt: "Photorealistic wide-angle exterior photo of a completed community shelter building in South Sudan, warm afternoon light",
  },
  {
    key: "kapoeta-container-8",
    label: "Carousel 8 – Bunk beds",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/bunkbeds-assembled-outdoor-kapoeta.jpg",
    aiPrompt: "Photorealistic documentary photo of assembled metal bunk beds ready at a children's shelter in South Sudan, warm daylight",
  },
  {
    key: "kapoeta-container-9",
    label: "Carousel 9 – Dormitory",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/bunkbeds-dormitory-interior-kapoeta-2.jpg",
    aiPrompt: "Photorealistic photo of a clean dormitory interior with rows of bunk beds in a children's shelter in South Sudan, natural window light",
  },
  {
    key: "kapoeta-container-10",
    label: "Carousel 10 – Community space",
    page: "Kapoeta Mission",
    defaultImage: "/images/kapoeta/field/community-hall-worship-service-kapoeta.jpg",
    aiPrompt: "Photorealistic documentary photo of a community gathering inside a hall at a children's shelter in South Sudan, warm light",
  },
];

const GALLERY_DEFAULTS: { src: string; label: string }[] = [
  { src: "/images/kapoeta/field/child-eating-bowl-rice-kapoeta.jpg",           label: "1 – Child eating" },
  { src: "/images/kapoeta/field/child-sibling-carrying-baby-kapoeta.jpg",      label: "2 – Siblings" },
  { src: "/images/kapoeta/field/children-sitting-bench-kapoeta.jpg",           label: "3 – Bench (1)" },
  { src: "/images/kapoeta/field/children-sitting-bench-kapoeta-2.jpg",         label: "4 – Bench (2)" },
  { src: "/images/kapoeta/field/child-tricycle-wheelchair-kapoeta.jpg",        label: "5 – Wheelchair" },
  { src: "/images/kapoeta/field/tukul-mud-hut-construction-kapoeta.jpg",       label: "6 – Before shelter" },
  { src: "/images/kapoeta/field/community-hall-chairs-interior-kapoeta.jpg",   label: "7 – Community hall" },
  { src: "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg",    label: "8 – Group activity" },
  { src: "/images/kapoeta/field/children-outdoor-activity-kapoeta.jpg",        label: "9 – Outdoor activity" },
  { src: "/images/kapoeta/field/children-coloring-activity-kapoeta.jpg",       label: "10 – Coloring" },
  { src: "/images/kapoeta/field/children-drawing-activity-outdoor-kapoeta.jpg",label: "11 – Drawing" },
  { src: "/images/kapoeta/field/children-toys-activity-kapoeta.jpg",           label: "12 – Toys" },
  { src: "/images/kapoeta/field/children-playing-mats-evening-kapoeta.jpg",    label: "13 – Evening play (1)" },
  { src: "/images/kapoeta/field/children-playing-mats-evening-kapoeta-2.jpg",  label: "14 – Evening play (2)" },
  { src: "/images/kapoeta/field/children-group-sunset-kapoeta.jpg",            label: "15 – End of day" },
  { src: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg",   label: "16 – School uniforms" },
  { src: "/images/kapoeta/field/girl-child-water-pump-kapoeta.jpg",            label: "17 – Water pump" },
  { src: "/images/people/mamdouh-mansour-cornfield-kapoeta.jpg",               label: "18 – Cornfield" },
  { src: "/images/kapoeta/field/girl-child-yellow-dress-holding-paper.jpg",    label: "19 – Yellow dress" },
  { src: "/images/kapoeta/field/visitor-woman-teaching-children-kapoeta.jpg",  label: "20 – Teaching" },
  { src: "/images/kapoeta/field/visitor-women-session-children-kapoeta.jpg",   label: "21 – Partner session" },
  { src: "/images/kapoeta/field/tribal-women-visitors-kapoeta.jpg",            label: "22 – Tribal welcome" },
  { src: "/images/people/mamdouh-mansour-children-kapoeta.jpg",                label: "23 – Mamdouh & children" },
  { src: "/images/people/mamdouh-mansour-kapoeta-field-2.jpg",                 label: "24 – Mamdouh field (1)" },
  { src: "/images/people/mamdouh-mansour-kapoeta-field-3.jpg",                 label: "25 – Mamdouh field (2)" },
  { src: "/images/people/mamdouh-child-woman-selfie-kapoeta.jpg",              label: "26 – Selfie (1)" },
  { src: "/images/people/mamdouh-woman-child-selfie-kapoeta.jpg",              label: "27 – Selfie (2)" },
];

export const GALLERY_SECTIONS: SiteSection[] = GALLERY_DEFAULTS.map(({ src, label }, i) => ({
  key: `kapoeta-gallery-${i + 1}`,
  label,
  page: "Kapoeta Gallery",
  defaultImage: src,
  aiPrompt: "Photorealistic documentary photograph from a children's shelter in Kapoeta, South Sudan, warm natural light, genuine candid moment",
}));

export const ALL_SITE_SECTIONS: SiteSection[] = [
  ...HOME_SECTIONS,
  ...KAPOETA_SECTIONS,
  ...GALLERY_SECTIONS,
];

export const ALL_SECTION_KEYS: string[] = ALL_SITE_SECTIONS.map((s) => s.key);
