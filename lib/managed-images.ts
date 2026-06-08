// ─── Managed image registry ────────────────────────────────────────────────
// Every editable photo on the public site is listed here with a stable key.
// The admin panel renders one upload / AI-generate / reset / caption control
// per entry, grouped by `group`. Public pages resolve each image as
//   config.images[key] ?? defaultSrc
// (see components/managed-images.tsx → useManagedImages).
//
// IMPORTANT: keys must match `^[a-z0-9-]+$` (validated by the upload route)
// and must stay stable — changing a key orphans any saved override.

export interface ManagedImageMeta {
  key: string;
  group: string;
  label: string;
  defaultSrc: string;
}

export const MANAGED_IMAGES: ManagedImageMeta[] = [
  // ── Home page ──────────────────────────────────────────────────────────
  { key: "home-hero", group: "Home page", label: "Hero background", defaultSrc: "/images/kapoeta/field/children-group-sunset-kapoeta.jpg" },
  { key: "home-mission-card", group: "Home page", label: "Kapoeta mission card", defaultSrc: "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg" },
  { key: "home-strip-1", group: "Home page", label: "Photo strip 1 — The children we found", defaultSrc: "/images/kapoeta/field/child-eating-bowl-rice-kapoeta.jpg" },
  { key: "home-strip-2", group: "Home page", label: "Photo strip 2 — The building going up", defaultSrc: "/images/kapoeta/field/shelter-steel-frame-construction-kapoeta.jpg" },
  { key: "home-strip-3", group: "Home page", label: "Photo strip 3 — Home", defaultSrc: "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg" },
  { key: "home-strip-4", group: "Home page", label: "Photo strip 4 — Their first safe beds", defaultSrc: "/images/kapoeta/field/community-hall-worship-service-kapoeta.jpg" },
  { key: "home-strip-5", group: "Home page", label: "Photo strip 5 — Going to school", defaultSrc: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg" },
  { key: "home-strip-6", group: "Home page", label: "Photo strip 6 — Teaching together", defaultSrc: "/images/kapoeta/field/visitor-woman-teaching-children-kapoeta.jpg" },
  { key: "home-strip-7", group: "Home page", label: "Photo strip 7 — Partners from Australia", defaultSrc: "/images/people/mamdouh-mansour-children-kapoeta.jpg" },

  // ── Kapoeta mission — hero & story ────────────────────────────────────────
  { key: "kapoeta-hero", group: "Kapoeta — hero & story", label: "Hero background", defaultSrc: "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg" },
  { key: "kapoeta-story-calling", group: "Kapoeta — hero & story", label: "Chapter 1 — The Calling", defaultSrc: "/images/kapoeta/field/children-outdoor-activity-kapoeta.jpg" },

  // ── Kapoeta mission — story carousel (The Container) ──────────────────────
  { key: "kapoeta-carousel-1", group: "Kapoeta — story carousel", label: "Mattresses packed in Sydney", defaultSrc: "/images/kapoeta/field/container-contents-mattresses-materials.jpg" },
  { key: "kapoeta-carousel-2", group: "Kapoeta — story carousel", label: "Donated cookware", defaultSrc: "/images/kapoeta/field/cooking-pots-donated-australia.jpg" },
  { key: "kapoeta-carousel-3", group: "Kapoeta — story carousel", label: "Rice and beans", defaultSrc: "/images/kapoeta/field/food-supplies-bags-rice-beans.jpg" },
  { key: "kapoeta-carousel-4", group: "Kapoeta — story carousel", label: "Steel frame going up", defaultSrc: "/images/kapoeta/field/shelter-steel-frame-construction-kapoeta.jpg" },
  { key: "kapoeta-carousel-5", group: "Kapoeta — story carousel", label: "Brick by brick", defaultSrc: "/images/kapoeta/field/shelter-brickwall-construction-progress.jpg" },
  { key: "kapoeta-carousel-6", group: "Kapoeta — story carousel", label: "Brick walls meet steel frame", defaultSrc: "/images/kapoeta/field/shelter-brickwall-steel-frame-kapoeta.jpg" },
  { key: "kapoeta-carousel-7", group: "Kapoeta — story carousel", label: "Completed building outside", defaultSrc: "/images/kapoeta/field/shelter-steel-frame-exterior-kapoeta.jpg" },
  { key: "kapoeta-carousel-8", group: "Kapoeta — story carousel", label: "Bunkbeds assembled", defaultSrc: "/images/kapoeta/field/bunkbeds-assembled-outdoor-kapoeta.jpg" },
  { key: "kapoeta-carousel-9", group: "Kapoeta — story carousel", label: "The dormitory inside", defaultSrc: "/images/kapoeta/field/bunkbeds-dormitory-interior-kapoeta-2.jpg" },
  { key: "kapoeta-carousel-10", group: "Kapoeta — story carousel", label: "A gathering space and a home", defaultSrc: "/images/kapoeta/field/community-hall-worship-service-kapoeta.jpg" },

  // ── Kapoeta mission — photo gallery ───────────────────────────────────────
  { key: "kapoeta-gallery-1", group: "Kapoeta — photo gallery", label: "A child found on the streets", defaultSrc: "/images/kapoeta/field/child-eating-bowl-rice-kapoeta.jpg" },
  { key: "kapoeta-gallery-2", group: "Kapoeta — photo gallery", label: "Brothers and sisters", defaultSrc: "/images/kapoeta/field/child-sibling-carrying-baby-kapoeta.jpg" },
  { key: "kapoeta-gallery-3", group: "Kapoeta — photo gallery", label: "A quiet moment", defaultSrc: "/images/kapoeta/field/children-sitting-bench-kapoeta.jpg" },
  { key: "kapoeta-gallery-4", group: "Kapoeta — photo gallery", label: "All together", defaultSrc: "/images/kapoeta/field/children-sitting-bench-kapoeta-2.jpg" },
  { key: "kapoeta-gallery-5", group: "Kapoeta — photo gallery", label: "Every child cared for", defaultSrc: "/images/kapoeta/field/child-tricycle-wheelchair-kapoeta.jpg" },
  { key: "kapoeta-gallery-6", group: "Kapoeta — photo gallery", label: "Before the shelter", defaultSrc: "/images/kapoeta/field/tukul-mud-hut-construction-kapoeta.jpg" },
  { key: "kapoeta-gallery-7", group: "Kapoeta — photo gallery", label: "The community space", defaultSrc: "/images/kapoeta/field/community-hall-chairs-interior-kapoeta.jpg" },
  { key: "kapoeta-gallery-8", group: "Kapoeta — photo gallery", label: "Together every day", defaultSrc: "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg" },
  { key: "kapoeta-gallery-9", group: "Kapoeta — photo gallery", label: "In the compound", defaultSrc: "/images/kapoeta/field/children-outdoor-activity-kapoeta.jpg" },
  { key: "kapoeta-gallery-10", group: "Kapoeta — photo gallery", label: "Coloring together", defaultSrc: "/images/kapoeta/field/children-coloring-activity-kapoeta.jpg" },
  { key: "kapoeta-gallery-11", group: "Kapoeta — photo gallery", label: "Drawing and learning", defaultSrc: "/images/kapoeta/field/children-drawing-activity-outdoor-kapoeta.jpg" },
  { key: "kapoeta-gallery-12", group: "Kapoeta — photo gallery", label: "Play is learning", defaultSrc: "/images/kapoeta/field/children-toys-activity-kapoeta.jpg" },
  { key: "kapoeta-gallery-13", group: "Kapoeta — photo gallery", label: "Evening play", defaultSrc: "/images/kapoeta/field/children-playing-mats-evening-kapoeta.jpg" },
  { key: "kapoeta-gallery-14", group: "Kapoeta — photo gallery", label: "Joy in simple things", defaultSrc: "/images/kapoeta/field/children-playing-mats-evening-kapoeta-2.jpg" },
  { key: "kapoeta-gallery-15", group: "Kapoeta — photo gallery", label: "End of the day", defaultSrc: "/images/kapoeta/field/children-group-sunset-kapoeta.jpg" },
  { key: "kapoeta-gallery-16", group: "Kapoeta — photo gallery", label: "Going to school", defaultSrc: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg" },
  { key: "kapoeta-gallery-17", group: "Kapoeta — photo gallery", label: "Clean water on site", defaultSrc: "/images/kapoeta/field/girl-child-water-pump-kapoeta.jpg" },
  { key: "kapoeta-gallery-18", group: "Kapoeta — photo gallery", label: "Growing their own food", defaultSrc: "/images/people/mamdouh-mansour-cornfield-kapoeta.jpg" },
  { key: "kapoeta-gallery-19", group: "Kapoeta — photo gallery", label: "Learning every day", defaultSrc: "/images/kapoeta/field/girl-child-yellow-dress-holding-paper.jpg" },
  { key: "kapoeta-gallery-20", group: "Kapoeta — photo gallery", label: "Teaching together", defaultSrc: "/images/kapoeta/field/visitor-woman-teaching-children-kapoeta.jpg" },
  { key: "kapoeta-gallery-21", group: "Kapoeta — photo gallery", label: "Partners from four continents", defaultSrc: "/images/kapoeta/field/visitor-women-session-children-kapoeta.jpg" },
  { key: "kapoeta-gallery-22", group: "Kapoeta — photo gallery", label: "Community welcomes visitors", defaultSrc: "/images/kapoeta/field/tribal-women-visitors-kapoeta.jpg" },
  { key: "kapoeta-gallery-23", group: "Kapoeta — photo gallery", label: "Elder Mamdouh with the children", defaultSrc: "/images/people/mamdouh-mansour-children-kapoeta.jpg" },
  { key: "kapoeta-gallery-24", group: "Kapoeta — photo gallery", label: "On the ground in Kapoeta", defaultSrc: "/images/people/mamdouh-mansour-kapoeta-field-2.jpg" },
  { key: "kapoeta-gallery-25", group: "Kapoeta — photo gallery", label: "Community partners", defaultSrc: "/images/people/mamdouh-mansour-kapoeta-field-3.jpg" },
  { key: "kapoeta-gallery-26", group: "Kapoeta — photo gallery", label: "Shared joy", defaultSrc: "/images/people/mamdouh-child-woman-selfie-kapoeta.jpg" },
  { key: "kapoeta-gallery-27", group: "Kapoeta — photo gallery", label: "Connection across continents", defaultSrc: "/images/people/mamdouh-woman-child-selfie-kapoeta.jpg" },
];

/** Ordered list of group names, for rendering the admin UI in a stable order. */
export const MANAGED_IMAGE_GROUPS: string[] = MANAGED_IMAGES.reduce<string[]>((acc, m) => {
  if (!acc.includes(m.group)) acc.push(m.group);
  return acc;
}, []);

/** A reasonable default AI prompt for a managed image, derived from its label. */
export function defaultAiPrompt(label: string): string {
  return `Photorealistic documentary photograph for a children's shelter in rural Kapoeta, South Sudan — ${label}. Warm golden natural light, candid and dignified, authentic field photography style.`;
}

/** The image/caption key for an admin-added extra Kapoeta gallery photo. */
export function galleryExtraKey(id: string): string {
  return `kapoeta-gallery-extra-${id}`;
}

/** The group name used for the Kapoeta photo gallery (kept in one place). */
export const KAPOETA_GALLERY_GROUP = "Kapoeta — photo gallery";
