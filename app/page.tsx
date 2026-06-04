import { HomeClient } from "@/app/home-client";
import { getConfig } from "@/lib/admin/store";

export default async function Home() {
  const { images, titles } = await getConfig();
  return <HomeClient imageOverrides={images} titleOverrides={titles} />;
}
