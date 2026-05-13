import type { Metadata } from "next";
import EventPublishingRequestForm from "@/components/forms/EventPublishingRequestForm";

export const metadata: Metadata = {
  title: "Publish Your College Event | Sophrion",
  description:
    "Colleges can submit event details for review. Approved events are published for students to discover and register.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-foreground/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),rgba(0,0,0,0))]" />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs tracking-[0.25em] text-foreground/60">
              COLLEGE PARTNER REQUEST
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Request Event Publishing on Sophrion
            </h1>
            <p className="text-sm text-foreground/70">
              Submit your event details. Our team reviews and publishes approved
              events so students can discover and register.
            </p>
            <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div id="request-form" className="max-w-3xl">
          <EventPublishingRequestForm />
        </div>

        <div className="mt-6 text-xs text-foreground/50">
          Note: Colleges and events are published only after admin approval.
        </div>
      </section>
          </div>
        </div>
        
      </section>

      {/* Form */}
      
    </div>
  );
}