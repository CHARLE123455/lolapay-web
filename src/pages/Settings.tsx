import { useSettings, useUpdateSettings } from "../hooks/queries";
import { errorMessage, type UserSettings } from "../lib/types";
import { PageTitle, Skeleton, Switch, useToast } from "../components/ui";

const LANGUAGES: Record<UserSettings["language"], string> = {
  en: "English",
  fr: "Français",
  yo: "Yorùbá",
  ha: "Hausa",
  ig: "Igbo",
};
const CURRENCIES: UserSettings["currency"][] = ["NGN", "USD", "GBP", "EUR"];
const THEMES: UserSettings["theme"][] = ["light", "dark", "system"];
type BoolKey =
  | "transactionAlerts"
  | "pushNotifications"
  | "emailNotifications"
  | "marketingEmails";

export default function SettingsPage() {
  const toast = useToast();
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();
  const save = (patch: Partial<UserSettings>) =>
    update.mutate(patch, {
      onSuccess: () => toast("Settings saved"),
      onError: (e) => toast(errorMessage(e), "error"),
    });

  if (isLoading || !settings) {
    return (
      <div className="card">
        <Skeleton lines={4} />
      </div>
    );
  }

  const bool = (key: BoolKey, title: string, desc: string) => (
    <div className="toggle" key={key}>
      <div>
        <b>{title}</b>
        <span>{desc}</span>
      </div>
      <Switch
        on={settings[key]}
        disabled={update.isPending}
        onChange={(v) => save({ [key]: v })}
      />
    </div>
  );

  return (
    <>
      <PageTitle
        title="Settings"
        subtitle="Preferences for your LolaPay experience."
      />
      <div className="grid-2">
        <section className="card">
          <div className="card-head">
            <h2>Preferences</h2>
          </div>
          <div className="toggle">
            <div>
              <b>Display currency</b>
              <span>
                Your wallet is held in NGN; this only affects display.
              </span>
            </div>
            <select
              className="input"
              style={{ width: 120 }}
              value={settings.currency}
              onChange={(e) =>
                save({ currency: e.target.value as UserSettings["currency"] })
              }
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="toggle">
            <div>
              <b>Language</b>
              <span>Interface language</span>
            </div>
            <select
              className="input"
              style={{ width: 140 }}
              value={settings.language}
              onChange={(e) =>
                save({ language: e.target.value as UserSettings["language"] })
              }
            >
              {Object.entries(LANGUAGES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="toggle">
            <div>
              <b>Theme</b>
              <span>Light, dark or follow your system</span>
            </div>
            <div className="tabs">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={settings.theme === t ? "active" : ""}
                  onClick={() => save({ theme: t })}
                >
                  {t[0]!.toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Notifications</h2>
          </div>
          {bool(
            "transactionAlerts",
            "Transaction alerts",
            "Get notified for every debit and credit.",
          )}
          {bool(
            "pushNotifications",
            "Push notifications",
            "Real-time alerts on your mobile device.",
          )}
          {bool(
            "emailNotifications",
            "Email notifications",
            "Receipts and security alerts by email.",
          )}
          {bool(
            "marketingEmails",
            "Product updates",
            "Occasional news about new LolaPay features.",
          )}
        </section>
      </div>
    </>
  );
}
