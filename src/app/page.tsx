import Link from "next/link";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "View Map", href: "/map" },
  { label: "Events", href: "#" },
  { label: "Reports", href: "#" },
];

const launchpadNotes = [
  "Darker palette with a single-page launch focus",
  "Site shell stays expandable for future tabs",
  "Background art can be swapped for photography later",
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-shell landing-shell--minimal">
        <header className="site-header site-header--minimal">
          <Link className="site-brand" href="/">
            <span className="site-brand__mark">PC</span>
            <span>
              <strong>Pokemon Card Locator</strong>
              <small>Local discovery for collectors</small>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {navigationItems.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <section className="launchpad-panel">
          <div className="launchpad-panel__content">
            <p className="eyebrow">Minimal launchpad</p>
            <h1>Open the map and start with the part that matters.</h1>
            <p className="lede">
              A simpler landing page with a darker palette, one dominant action,
              and enough structure to grow into events, reports, or guides later
              without cluttering the first screen.
            </p>

            <div className="launchpad-panel__actions">
              <Link className="primary-link" href="/map">
                View map
              </Link>
            </div>

            <ul className="launchpad-panel__list" aria-label="Launchpad notes">
              {launchpadNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="launchpad-visual" aria-hidden="true">
            <div className="launchpad-visual__badge">
              <span>Current focus</span>
              <strong>Store map</strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
