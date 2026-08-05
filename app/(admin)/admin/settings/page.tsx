import { getSettings } from "@/actions/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-700 mb-1">Settings</h1>
      <p className="font-body text-sm text-gray-500 mb-6">
        Store-wide shipping, business, and social link configuration.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
