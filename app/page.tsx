import { getConfig } from "@/lib/admin/store";
import { ManagedImagesProvider } from "@/components/managed-images";
import HomeClient from "./home-client";

// Render per request so admin photo/caption changes appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { images, captions } = await getConfig();
  return (
    <ManagedImagesProvider images={images} captions={captions}>
      <HomeClient />
    </ManagedImagesProvider>
  );
}
