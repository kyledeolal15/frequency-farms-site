import LegalLayout from "../components/LegalLayout";
import { INQUIRIES_EMAIL } from "../lib/site-config";

// A solid starting draft, not a substitute for your own legal review -
// especially once you're collecting SMS opt-ins at real volume or
// operating in states with their own privacy statutes (California,
// Virginia, Colorado, etc. each add a few specifics beyond this).
export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 2026">
      <p>
        This Privacy Policy explains what information Frequency Farms
        ("we," "us," or "our") collects through this website, how we use
        it, and the choices you have. This site is intended for adults 21
        and older and is for brand and education purposes only - it is not
        a store, and no purchase happens here.
      </p>

      <h2>Information we collect</h2>
      <p>We collect information in two ways:</p>
      <ul>
        <li>
          <strong>Information you give us directly</strong>, when you fill
          out a form on this site: your name, phone number, and email
          address (sign-up form), or your business name, contact name,
          email, phone, and message (wholesale inquiry form).
        </li>
        <li>
          <strong>Information collected automatically</strong>, such as
          your IP address, browser and device type, and which pages you
          visit, through standard web hosting and analytics tools. This is
          used in aggregate to understand site traffic, not to identify
          you personally.
        </li>
      </ul>
      <p>
        We do not ask for or knowingly collect government ID numbers,
        payment information, or any information from anyone under 21.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>
          To send you the marketing texts and/or emails you opted into -
          brand and spectrum education, new strain announcements, and
          alerts when a strain lands at a dispensary near you.
        </li>
        <li>To respond to wholesale and retailer inquiries.</li>
        <li>To operate, maintain, and improve this website.</li>
        <li>To comply with applicable law and licensing requirements.</li>
      </ul>
      <p>
        We do not sell your personal information, and we do not share your
        phone number or email with third parties for their own marketing
        purposes.
      </p>

      <h2>Who we share information with</h2>
      <p>
        We share information only with the service providers who help us
        run this site and our marketing list - for example, our website
        hosting provider and our email/SMS sending platform - and only to
        the extent needed for them to provide that service to us. We may
        also disclose information if required by law or to a licensing
        authority in connection with our cannabis license.
      </p>

      <h2>SMS and email marketing</h2>
      <p>
        If you sign up to receive text messages, your consent is recorded
        along with the number provided. Message frequency varies, and
        message and data rates may apply. You can opt out of texts at any
        time by replying STOP, and out of emails using the unsubscribe
        link in any email. See our{" "}
        <a href="/terms">Terms</a> for the full SMS program terms.
      </p>

      <h2>Cookies and similar technology</h2>
      <p>
        This site may use basic cookies or similar technology for
        analytics purposes, to understand how visitors use the site. These
        do not identify you personally and are not used to build an
        advertising profile.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep the information you submit for as long as needed to
        provide the marketing or response you signed up for, or until you
        ask us to delete it, whichever comes first.
      </p>

      <h2>Your choices and rights</h2>
      <p>You can:</p>
      <ul>
        <li>Opt out of texts anytime by replying STOP, or emails via the unsubscribe link.</li>
        <li>
          Ask us what information we have about you, ask us to correct it,
          or ask us to delete it, by emailing{" "}
          <a href={`mailto:${INQUIRIES_EMAIL}`}>{INQUIRIES_EMAIL}</a>.
        </li>
      </ul>
      <p>
        If you live in a state with its own consumer privacy law (such as
        California, Colorado, Connecticut, Virginia, or others), you may
        have additional rights under that law; contact us at the email
        above and we'll honor applicable requests.
      </p>

      <h2>Children's privacy</h2>
      <p>
        This site is intended only for adults 21 years of age or older. We
        do not knowingly collect information from anyone under 21. If you
        believe a minor has submitted information to us, contact us and we
        will delete it.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable measures to protect the information you provide,
        but no method of transmission or storage is 100% secure, and we
        can't guarantee absolute security.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last
        updated" date at the top of this page reflects the most recent
        changes.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy or your information? Email us at{" "}
        <a href={`mailto:${INQUIRIES_EMAIL}`}>{INQUIRIES_EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}
