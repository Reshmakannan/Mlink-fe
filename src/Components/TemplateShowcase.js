import React, { useEffect, useState } from "react";
import TemplatePreview from "./TemplatePreview";
import { getTemplate, categoryLabel } from "../Data/templates";
import "../Style/TemplateShowcase.css";

const DEMO_TEMPLATES = [
  { id: "fashion-pro-01", name: "Maya Laurent", username: "mayalaurent", category: "fashion" },
  { id: "business-premium-02", name: "Arjun Mehta", username: "arjunmehta", category: "business" },
  { id: "technology-premium-03", name: "Alex Morgan", username: "alexmorgan", category: "technology" },
  { id: "creator-premium-04", name: "Nia Williams", username: "niawilliams", category: "creator" },
];

const SAMPLE_PROFILE = {
  bio: "Creating meaningful work and sharing what inspires me.",
  location: "Your city",
  links: [
    { id: "portfolio", icon: "website", label: "My portfolio" },
    { id: "contact", icon: "email", label: "Get in touch" },
  ],
  socials: [
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
  ],
};

export default function TemplateShowcase() {
  const [openTemplateId, setOpenTemplateId] = useState(null);
  const openTemplate = DEMO_TEMPLATES.find((demo) => demo.id === openTemplateId);
  const template = openTemplate ? getTemplate(openTemplate.id) : null;

  useEffect(() => {
    if (!template) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenTemplateId(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [template]);

  const closePreview = () => setOpenTemplateId(null);

  return (
    <section className="template-showcase" id="templates" aria-labelledby="template-showcase-title">
      <div className="template-showcase__inner">
        <header className="template-showcase__header">
          <p className="template-showcase__eyebrow">Made for your next chapter</p>
          <h2 id="template-showcase-title">A first look at MLink templates</h2>
          <p>Explore a few styles from the MLink template library, designed to make your profile feel like you.</p>
        </header>

        <div className="template-showcase__grid">
          {DEMO_TEMPLATES.map((demo) => {
            const template = getTemplate(demo.id);
            if (!template) return null;

            return (
              <button
                type="button"
                className="template-showcase__card"
                key={template.id}
                aria-label={`Preview ${template.name} template`}
                onClick={() => setOpenTemplateId(template.id)}
              >
                <div className="template-showcase__preview">
                  <TemplatePreview
                    template={template}
                    profile={{ ...SAMPLE_PROFILE, ...demo }}
                    decorative
                  />
                </div>
                <div className="template-showcase__details">
                  <h3>{template.name}</h3>
                  <p>{categoryLabel(template.category)} · {template.styleName}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {template && openTemplate && (
        <div className="template-showcase__overlay" onClick={closePreview}>
          <div
            className="template-showcase__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-showcase-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="template-showcase__close"
              aria-label="Close template preview"
              onClick={closePreview}
            >
              &times;
            </button>
            <div className="template-showcase__live-stage">
              <div className="template-showcase__live-phone">
                <TemplatePreview
                  template={template}
                  profile={{ ...SAMPLE_PROFILE, full_name: openTemplate.name, ...openTemplate }}
                  live
                />
              </div>
            </div>
            <div className="template-showcase__live-info">
              <p className="template-showcase__eyebrow">{categoryLabel(template.category)}</p>
              <h2 id="template-showcase-dialog-title">{template.name}</h2>
              <p className="template-showcase__live-style">{template.styleName} style</p>
              <p className="template-showcase__live-description">
                Preview this profile design and try its Home, Gallery, and About sections.
                Your own profile details will replace this demo content when you create a page.
              </p>
              <button type="button" className="template-showcase__done" onClick={closePreview}>
                Back to templates
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
