import { getSiteSettings, getHeroSlides } from "@/lib/settings";
import HomepageSettingsForm from "@/components/admin/HomepageSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const [settings, heroSlides] = await Promise.all([getSiteSettings(), getHeroSlides()]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Personalizza Home page</h1>
      <HomepageSettingsForm initial={{ ...settings, heroSlides }} />
    </div>
  );
}
