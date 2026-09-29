import LegalLayout from "../components/LegalLayout";
import { INQUIRIES_EMAIL } from "../lib/site-config";

// Covers both general site-use terms and the SMS/email program terms
// referenced by the consent checkbox on the sign-up form. Same caveat as
// privacy.js: a solid starting draft, worth a real legal review before
// you're collecting opt-ins at real volume.
export default function Terms() {
  return (
    <LegalLayout title="Terms" updated="September 2026">
      <h2>Acceptance of these terms</h2>
      <p>
        By using this website, you agree to these Terms. If you do not
        agree, please do not use the site. This site is intended only for
        adults 21 years of age or older.
      </p>

      <h2>What this site is</h2>
      <p>
        This is a brand and education website for Frequency Farms. It does
        not sell, ship, or facilitate the purchase of any cannabis
        product. Nothing on this site is an offer to sell cannabis in any
        jurisdiction where it is not legally available, and availability
        varies by state and by dispensary. Content on this site, including
        strain and Frequency Spectrum descriptions, is for informational
        and educational purposes and is not medical advice.
      </p>

      <h2>SMS messaging program</h2>
      <p>
        By checking the consent box and submitting your phone number, you
        agree to receive recurring automated marketing text messages
        (including cart-free brand updates, spectrum education, new
        strain announcements, and dispensary availability alerts) from
        Frequency Farms at the mobile number provided.
      </p>
      <ul>
        <li>Consent to receive texts is not a condition of any purchase.</li>
        <li>Message frequency varies.</li>
        <li>Message and data rates may apply.</li>
        <li>
          Reply <strong>STOP</strong> at any time to cancel. Reply{" "}
          <strong>HELP</strong> for help.
        </li>
        <li>
          We use your number only for this program and as described in our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </li>
        <li>
          Carriers are not liable for delayed or undelivered messages.
        </li>
      </ul>
      <p>
        For help with the SMS program, email{" "}
        <a href={`mailto:${INQUIRIES_EMAIL}`}>{INQUIRIES_EMAIL}</a>.
      </p>

      <h2>Email marketing</h2>
      <p>
        By submitting your email address, you agree to receive marketing
        emails from Frequency Farms. Every email includes an unsubscribe
        link, and you can opt out at any time.
      </p>

      <h2>Age requirement</h2>
      <p>
        You must be 21 years of age or older to use this site. By using
        it, you represent that you meet this requirement.
      </p>

      <h2>Wholesale inquiries</h2>
      <p>
        Submitting the wholesale inquiry form does not create any
        obligation on either side to enter into a business relationship.
        We'll follow up directly with anyone whose inquiry we can act on.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Frequency Farms name, logo, Frequency Spectrum system, and all
        content on this site are the property of Frequency Farms and may
        not be copied or used without permission.
      </p>

      <h2>No warranty, limitation of liability</h2>
      <p>
        This site and its content are provided "as is," without warranties
        of any kind. To the fullest extent permitted by law, Frequency
        Farms is not liable for any indirect, incidental, or consequential
        damages arising from your use of this site.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. The "Last updated"
        date at the top of this page reflects the most recent changes.
        Continued use of the site after a change means you accept the
        updated Terms.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these Terms? Email us at{" "}
        <a href={`mailto:${INQUIRIES_EMAIL}`}>{INQUIRIES_EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}
