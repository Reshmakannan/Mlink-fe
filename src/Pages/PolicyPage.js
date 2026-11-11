import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Style/PolicyPage.css';

const SUPPORT_EMAIL = 'info.mpeoples@gmail.com';
const SUPPORT_PHONE = '9487812715';
const BUSINESS_LOCATION = 'Salem, Tamil Nadu, India';
const LAST_UPDATED = 'October 29, 2026';

const PLAN_PRICES = [
  { name: 'Basic', prices: ['₹199', '₹539', '₹1,079', '₹2,159'], features: '2 profile links · 1 social media link · 5 templates per category · Basic customization' },
  { name: 'Standard', prices: ['₹379', '₹1,049', '₹2,099', '₹4,199'], features: '5 profile links · 3 social media links · 10 templates per category · Basic customization' },
  { name: 'Pro', prices: ['₹449', '₹1,199', '₹2,399', '₹4,799'], features: 'Unlimited profile links · Unlimited social media links · 25 templates per category · Basic customization' },
];

const POLICY_LINKS = [
  { to: '/about', label: 'About us' },
  { to: '/services', label: 'Services & pricing' },
  { to: '/terms', label: 'Terms and conditions' },
  { to: '/privacy', label: 'Privacy policy' },
  { to: '/cancellation-refund', label: 'Cancellation and refund' },
  { to: '/shipping-delivery', label: 'Shipping and delivery' },
  { to: '/disclaimer', label: 'Disclaimer' },
  { to: '/contact', label: 'Contact us' },
];

const PAGES = {
  about: {
    title: 'About us',
    description: 'Learn about MLink, a digital profile and link-sharing platform.',
    intro: 'One professional profile for everything you share.',
    content: (
      <>
        <p>
          MLink helps people bring their important links, social profiles, and professional
          information together in one shareable digital profile.
        </p>
        <p>
          Create a profile, choose a design, add the links you want visitors to find, and share
          your MLink page wherever you connect with people.
        </p>
        <h2>Our purpose</h2>
        <p>
          We aim to make it easier for creators, professionals, and businesses to present their
          online presence clearly in one place.
        </p>
        <p>
          MLink is a digital service. We do not sell or ship physical products.
        </p>
      </>
    ),
  },
  services: {
    title: 'Products, services and pricing',
    description: 'Compare MLink digital profile plans, features, access periods, and displayed prices.',
    intro: 'Choose a digital profile plan for the access period that suits you.',
    content: (
      <>
        <p>
          MLink provides digital profile pages, profile templates, link and social media
          placement, and basic profile customization. Plan access begins after payment is
          confirmed and lasts for the selected period.
        </p>
        <div className="policy-table-wrap">
          <table className="policy-table">
            <caption>Plan features and displayed prices (INR)</caption>
            <thead>
              <tr>
                <th scope="col">Plan</th>
                <th scope="col">1 month</th>
                <th scope="col">3 months</th>
                <th scope="col">6 months</th>
                <th scope="col">12 months</th>
                <th scope="col">Included features</th>
              </tr>
            </thead>
            <tbody>
              {PLAN_PRICES.map((plan) => (
                <tr key={plan.name}>
                  <th scope="row">{plan.name}</th>
                  {plan.prices.map((price, index) => <td key={`${plan.name}-${index}`}>{price}</td>)}
                  <td>{plan.features}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The prices above are the prices displayed on the plan cards. The final amount payable
          for an order is shown in the checkout/payment confirmation before you authorize
          payment. Plans are currently paid once for the selected period and do not automatically
          renew.
        </p>
        <p>
          Plan features and prices may change for future purchases. A change does not alter an
          already-confirmed purchase during its paid access period.
        </p>
        <p>
          <Link to="/pricing">View plans and choose a plan</Link>
        </p>
      </>
    ),
  },
  terms: {
    title: 'Terms and conditions',
    description: 'Terms for using MLink profiles, features, and paid plans.',
    intro: 'Please read these terms before using MLink or purchasing a plan.',
    content: (
      <>
        <h2>Using MLink</h2>
        <p>
          You are responsible for the accuracy of the information, images, and links you add to
          your account. Do not use MLink to publish unlawful, misleading, abusive, or infringing
          material, or to distribute harmful content.
        </p>
        <p>
          Keep your account credentials secure. You are responsible for activity carried out
          through your account and should contact us promptly if you believe it has been
          accessed without permission.
        </p>
        <h2>Profiles and external links</h2>
        <p>
          Profiles you publish may be visible to anyone with the profile link. You control what
          you publish and should not include personal or confidential information you do not
          want to make public. Links can lead to third-party services; MLink does not control
          their content or availability.
        </p>
        <h2>Plans and payments</h2>
        <p>
          Paid plans provide the features shown for the selected plan and access period. The
          checkout page displays the final amount payable before you confirm payment. Plans
          currently use a one-time payment and do not automatically renew. Access ends when the
          selected period expires unless you purchase another plan.
        </p>
        <p>
          Cancellation and refund requests are handled under our{' '}
          <Link to="/cancellation-refund">Cancellation and Refund Policy</Link>.
        </p>
        <h2>Service availability and changes</h2>
        <p>
          We work to keep MLink available and improve the service, but maintenance, technical
          issues, or circumstances outside our control may interrupt access. We may update
          features or these terms; material terms for a purchase are those presented at the
          time of checkout.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy policy',
    description: 'How MLink handles account, profile, and payment-related information.',
    intro: 'This policy explains what information is used to provide MLink.',
    content: (
      <>
        <h2>Information you provide</h2>
        <p>
          MLink may process account details and the profile information you choose to add,
          including your name, username, email address, phone number, biography, location,
          profile photo, gallery images, social links, and other profile links.
        </p>
        <h2>How information is used</h2>
        <p>
          We use this information to create and maintain your account and profile, provide
          selected features, manage plan access and payments, respond to support requests, and
          protect the service from misuse.
        </p>
        <h2>Public profiles</h2>
        <p>
          When you publish a profile, the profile information and links included on it can be
          viewed by visitors. Do not publish information you intend to keep private. Unpublishing
          a profile stops it being served as a published MLink page, but copies or search-engine
          records outside our control may persist.
        </p>
        <h2>Payments and service providers</h2>
        <p>
          Payments are handled through the payment provider presented during checkout. The
          provider may collect payment and billing information under its own privacy terms.
          MLink receives information needed to confirm and manage the order, such as its status
          and transaction reference.
        </p>
        <p>
          We may rely on hosting, infrastructure, and payment service providers to operate
          MLink. Information is shared with them only as needed to provide and protect the
          service or comply with legal requirements.
        </p>
        <h2>Your choices and requests</h2>
        <p>
          You can edit profile information through your account. To ask a privacy question or
          request help with account information, contact{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
        <h2>Policy updates</h2>
        <p>
          We may update this policy as the service changes. The latest version and its update
          date will be posted on this page.
        </p>
      </>
    ),
  },
  'cancellation-refund': {
    title: 'Cancellation and refund policy',
    description: 'How to request cancellation or a refund for an MLink plan.',
    intro: 'Plans are one-time digital purchases and do not automatically renew.',
    content: (
      <>
        <h2>Cancellation</h2>
        <p>
          An MLink plan is purchased for a fixed period and does not automatically renew. There
          is no recurring plan payment to stop. If you stop using the service, access remains
          available through the paid period and ends when that period expires.
        </p>
        <h2>Refund requests</h2>
        <p>
          You may submit a refund request within 7 days of purchase. Email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the account email,
          purchase date, and payment/order reference, if available.
        </p>
        <p>
          We will review the request and reply using the contact details provided. If a refund
          is approved, it will be returned through the original payment method where possible.
          The time for the funds to appear depends on the payment provider and your bank.
        </p>
        <h2>After a refund</h2>
        <p>
          When a full plan refund is issued, the paid plan features associated with that
          purchase may be removed. This policy does not limit rights that cannot be excluded
          under applicable law.
        </p>
      </>
    ),
  },
  'shipping-delivery': {
    title: 'Shipping and delivery policy',
    description: 'Delivery information for MLink digital profile plans.',
    intro: 'MLink is a digital service; no physical goods are shipped.',
    content: (
      <>
        <h2>Digital delivery</h2>
        <p>
          MLink plans, templates, and profile features are delivered electronically. There are
          no shipping fees, tracking numbers, or physical deliveries.
        </p>
        <h2>When access is available</h2>
        <p>
          After the payment provider confirms a successful payment, the purchased plan is
          activated on the associated MLink account. Access is for the plan period selected at
          checkout. Payment confirmation or provider delays may take additional time.
        </p>
        <p>
          If payment is confirmed but the plan is not available, contact{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and include your account email
          and payment/order reference.
        </p>
      </>
    ),
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'Important information about MLink and third-party links.',
    intro: 'Please consider these limitations when using MLink.',
    content: (
      <>
        <h2>Service information</h2>
        <p>
          MLink is provided as a digital profile and link-sharing service. We aim to keep
          information and features useful and available, but cannot promise uninterrupted or
          error-free operation.
        </p>
        <h2>User content and third parties</h2>
        <p>
          Profile owners are responsible for content and links they publish. A link to an
          external website does not mean MLink endorses it. We do not control external sites,
          their content, privacy practices, or availability.
        </p>
        <h2>No professional advice</h2>
        <p>
          Information displayed by users through MLink is not professional, legal, medical, or
          financial advice from MLink. Visitors should independently assess information and
          third-party services.
        </p>
        <p>
          Nothing in this disclaimer excludes protections or responsibilities that cannot be
          excluded under applicable law.
        </p>
      </>
    ),
  },
  contact: {
    title: 'Contact us',
    description: 'Contact MLink support for account, payment, privacy, and policy questions.',
    intro: 'We’re here to help with your MLink account and purchases.',
    content: (
      <>
        <div className="policy-contact">
          <p>
            <strong>Email</strong>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
          <p>
            <strong>Phone</strong>
            <a href={`tel:${SUPPORT_PHONE}`}>{SUPPORT_PHONE}</a>
          </p>
          <p>
            <strong>Location</strong>
            <span>{BUSINESS_LOCATION}</span>
          </p>
        </div>
        <p>
          For payment or refund questions, include the email address on your MLink account and
          your payment/order reference. Please do not send passwords or full card details.
        </p>
      </>
    ),
  },
};

export default function PolicyPage({ page }) {
  const content = PAGES[page];

  useEffect(() => {
    if (!content) return undefined;
    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag && descriptionTag.content;

    document.title = `${content.title} | MLink`;
    if (descriptionTag) descriptionTag.setAttribute('content', content.description);

    return () => {
      document.title = previousTitle || 'MLink | Digital Profiles';
      if (descriptionTag && previousDescription) {
        descriptionTag.setAttribute('content', previousDescription);
      }
    };
  }, [content]);

  if (!content) return null;

  return (
    <main className="policy-page">
      <div className="policy-page__inner">
        <nav className="policy-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{content.title}</span>
        </nav>
        <header className="policy-page__header">
          <p className="policy-page__eyebrow">MLink information</p>
          <h1>{content.title}</h1>
          <p className="policy-page__intro">{content.intro}</p>
          <p className="policy-page__updated">Last updated: {LAST_UPDATED}</p>
        </header>
        <article className="policy-page__content">{content.content}</article>
        <nav className="policy-page__related" aria-label="Company information">
          {POLICY_LINKS.filter((link) => link.to !== `/${page}`).map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
