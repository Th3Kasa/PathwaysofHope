"use client";

import { createContext, useContext } from "react";

interface Overrides {
  images: Record<string, string>;
  captions: Record<string, string>;
}

const ManagedImagesContext = createContext<Overrides>({ images: {}, captions: {} });

/**
 * Provides admin image/caption overrides to a client subtree. Server pages
 * fetch the admin config and pass `images` (config.images) and `captions`
 * (config.captions) as plain objects.
 */
export function ManagedImagesProvider({
  images,
  captions,
  children,
}: {
  images?: Record<string, string>;
  captions?: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <ManagedImagesContext.Provider value={{ images: images ?? {}, captions: captions ?? {} }}>
      {children}
    </ManagedImagesContext.Provider>
  );
}

/**
 * Resolve managed images by key.
 *   img(key, defaultSrc)  → override URL if set, else the default
 *   cap(key, fallback)    → admin caption override if set, else the fallback
 */
export function useManagedImages() {
  const { images, captions } = useContext(ManagedImagesContext);
  return {
    img: (key: string, defaultSrc: string) => images[key] ?? defaultSrc,
    cap: (key: string, fallback: string) => captions[key] ?? fallback,
  };
}
