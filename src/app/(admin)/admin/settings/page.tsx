export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Admin Settings</h1>
        <p className="text-sm text-foreground/60">
          Platform configuration and admin preferences.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-foreground">Platform</h2>
          <p className="text-sm text-foreground/60">
            Sophrion admin console configuration.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-foreground/80">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-foreground/60">Environment:</span>
            <span className="text-foreground">Production</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-foreground/60">Deployment:</span>
            <span className="text-foreground">Vercel</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-foreground/60">Database:</span>
            <span className="text-foreground">Supabase</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-foreground/60">Email Service:</span>
            <span className="text-foreground">ZeptoMail</span>
          </div>
        </div>
      </div>
    </div>
  );
}