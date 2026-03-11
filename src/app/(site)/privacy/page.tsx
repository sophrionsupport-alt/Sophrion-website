import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Sophrion collects, uses, stores, and protects your information across its website, forms, events, and related services.",
};

const LAST_UPDATED = "March 10, 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/3 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-white/70 md:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(900px circle at 0% 0%, rgba(99,102,241,0.10), transparent 35%),
            radial-gradient(700px circle at 100% 10%, rgba(34,211,238,0.08), transparent 30%)
          `,
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-white/65 transition hover:text-white"
          >
            ← Back to home
          </Link>
        </div>

        <section className="rounded-4xl border border-white/10 bg-white/3 px-6 py-10 md:px-8 md:py-12">
          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
              Legal
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/65">
              This Privacy Policy explains how Sophrion collects, uses,
              stores, and protects information when you use our website,
              forms, applications, events, newsletters, and related services.
            </p>

            <div className="mt-6 inline-flex rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70">
              Last updated: {LAST_UPDATED}
            </div>
          </div>
        </section>

        <Section title="1. Who we are">
          <p>
            Sophrion is a technology-driven platform focused on building future-ready
            solutions across areas such as education, events, institutional
            engagement, career opportunities, and related digital experiences.
          </p>
          <p>
            In this policy, “Sophrion,” “we,” “our,” and “us” refer to the
            operators of the Sophrion website and related services. “You” refers
            to any visitor, user, applicant, subscriber, participant, partner,
            institution, or other person interacting with our services.
          </p>
        </Section>

        <Section title="2. Information we collect">
          <p>We may collect the following categories of information:</p>

          <div className="space-y-3">
            <div>
              <p className="font-medium text-white">Information you provide directly</p>
              <p>
                This may include your name, email address, phone number, college
                or institution name, academic details, LinkedIn or portfolio links,
                application details, event registration details, messages submitted
                through forms, and any other information you choose to share.
              </p>
            </div>

            <div>
              <p className="font-medium text-white">Usage and technical information</p>
              <p>
                We may collect technical information such as IP address, browser
                type, device information, operating system, approximate location,
                referral source, pages viewed, session activity, and timestamps.
              </p>
            </div>

            <div>
              <p className="font-medium text-white">Uploaded or submitted content</p>
              <p>
                If you apply for opportunities, register for programs, or use
                related forms, we may collect resumes, cover letters, project links,
                portfolio links, and supporting materials you submit.
              </p>
            </div>

            <div>
              <p className="font-medium text-white">Communication data</p>
              <p>
                If you contact us, subscribe to updates, or respond to our emails,
                we may keep records of those communications.
              </p>
            </div>
          </div>
        </Section>

        <Section title="3. How we use your information">
          <p>We may use your information to:</p>

          <ul className="list-disc space-y-2 pl-5">
            <li>operate, maintain, and improve our website and services</li>
            <li>respond to inquiries, requests, and support messages</li>
            <li>process event registrations, applications, subscriptions, and other submissions</li>
            <li>review career or collaboration applications</li>
            <li>send transactional emails, confirmations, updates, and service communications</li>
            <li>send newsletters or announcements where you have opted in or where permitted</li>
            <li>understand usage trends, performance, and user engagement</li>
            <li>maintain platform security, detect abuse, and prevent fraud or misuse</li>
            <li>comply with legal obligations and enforce our terms, rights, and policies</li>
          </ul>
        </Section>

        <Section title="4. Legal basis and consent">
          <p>
            Where applicable, we process personal information based on one or more
            of the following grounds: your consent, performance of a requested
            service, our legitimate business interests, compliance with legal
            obligations, or protection of our rights and operations.
          </p>
          <p>
            Where you voluntarily submit information through a form, application,
            registration flow, or newsletter signup, you consent to the use of
            that information for the relevant purpose.
          </p>
        </Section>

        <Section title="5. Cookies and analytics">
          <p>
            We may use cookies, similar technologies, analytics tools, and basic
            tracking mechanisms to understand traffic, improve user experience,
            remember preferences, and measure site performance.
          </p>
          <p>
            These tools may collect technical and behavioral information such as
            page visits, interactions, browser details, referral paths, and
            approximate geography.
          </p>
          <p>
            You can control cookies through your browser settings. Disabling some
            cookies may affect certain site functions.
          </p>
        </Section>

        <Section title="6. Email communications">
          <p>
            We may send emails related to your registrations, applications,
            inquiries, subscriptions, or use of our services. These may include
            acknowledgements, confirmations, updates, review-status notifications,
            event communication, and administrative notices.
          </p>
          <p>
            Marketing or newsletter communications may include an unsubscribe
            option where applicable. Transactional or service-related emails may
            still be sent when necessary to complete a process you initiated or to
            operate the service.
          </p>
        </Section>

        <Section title="7. Career applications and recruitment data">
          <p>
            If you apply for a role, internship, program, or talent network
            opportunity, we may collect and review the information you submit,
            including professional, academic, and portfolio-related details.
          </p>
          <p>
            That information may be used to evaluate fit, communicate status,
            maintain internal review records, and contact you regarding current or
            relevant future opportunities, unless you request otherwise.
          </p>
          <p>
            Submission of an application does not guarantee selection, interview,
            or employment.
          </p>
        </Section>

        <Section title="8. Event and program registrations">
          <p>
            If you register for an event, workshop, hackathon, campus initiative,
            or related program, we may use your information to manage attendance,
            review submissions, issue confirmations, coordinate logistics, and
            communicate updates before, during, and after the event.
          </p>
          <p>
            We may also use aggregated or non-identifiable event data to improve
            future programs and operational planning.
          </p>
        </Section>

        <Section title="9. Sharing of information">
          <p>We do not sell your personal information.</p>
          <p>We may share information in limited situations, such as:</p>

          <ul className="list-disc space-y-2 pl-5">
            <li>with service providers supporting hosting, forms, databases, analytics, email delivery, or file storage</li>
            <li>with internal team members, reviewers, or authorized operators who need access for legitimate operational purposes</li>
            <li>with event, institutional, or operational partners where required to deliver a service you requested</li>
            <li>where disclosure is required by law, regulation, legal process, or lawful government request</li>
            <li>to protect the safety, rights, property, systems, users, or legal interests of Sophrion or others</li>
          </ul>
        </Section>

        <Section title="10. Data retention">
          <p>
            We retain information for as long as reasonably necessary for the
            purposes described in this policy, including service delivery,
            recordkeeping, compliance, dispute resolution, platform security, and
            internal operational needs.
          </p>
          <p>
            Retention periods may vary depending on the type of information,
            sensitivity, legal requirements, and whether the data relates to an
            active inquiry, application, registration, or account-level activity.
          </p>
        </Section>

        <Section title="11. Data security">
          <p>
            We take reasonable technical and organizational measures to protect
            information against unauthorized access, misuse, loss, disclosure,
            alteration, or destruction.
          </p>
          <p>
            However, no digital system, network, or storage mechanism is fully
            secure. You use the website and submit information at your own risk,
            and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="12. Your choices and rights">
          <p>
            Depending on applicable law, you may have rights to request access to,
            correction of, update of, or deletion of certain personal information.
            You may also request that we stop certain communications or withdraw
            consent where processing is based on consent.
          </p>
          <p>
            To make a privacy-related request, contact us using the contact details
            provided below. We may need to verify your identity before acting on a
            request.
          </p>
        </Section>

        <Section title="13. Third-party links and services">
          <p>
            Our website may contain links to third-party websites, platforms,
            applications, forms, social profiles, or tools. We are not responsible
            for the privacy practices, content, policies, or security of third-party
            services.
          </p>
          <p>
            You should review the privacy policies of those services separately
            before sharing information with them.
          </p>
        </Section>

        <Section title="14. Children’s privacy">
          <p>
            Our services are not intentionally directed to children who are below
            the age required under applicable law to provide valid consent on their
            own. If you believe personal information has been submitted improperly
            by or about a minor, contact us so we can review and take appropriate
            action.
          </p>
        </Section>

        <Section title="15. International use">
          <p>
            If you access our services from outside the country where our systems
            or service providers operate, your information may be processed or
            stored in other jurisdictions. By using the service, you understand
            that such transfers may occur as part of normal service operation.
          </p>
        </Section>

        <Section title="16. Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes
            in our services, operations, legal requirements, or data practices.
          </p>
          <p>
            The updated version will be posted on this page with a revised “Last
            updated” date. Continued use of our services after changes means the
            updated policy will apply.
          </p>
        </Section>

        <Section title="17. Contact us">
          <p>
            For privacy-related questions, requests, or concerns, contact us
            through our official contact channels on the Sophrion website.
          </p>
          <p>
            You can also use the{" "}
            <Link
              href="/contact"
              className="text-cyan-300 underline underline-offset-4"
            >
              contact page
            </Link>{" "}
            to reach us regarding privacy matters.
          </p>
        </Section>
      </div>
    </main>
  );
}