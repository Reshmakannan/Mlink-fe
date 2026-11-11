import React, { useState } from 'react';
import { photoSrc } from '../Api/Profileapi';
import LinkIcon from './LinkIcon';
import { applyCustomization } from '../Data/templates';
import '../Style/Templates.css';

function initials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

/**
 * Draws one template with the user's saved profile and links inside it.
 * Everything scales with the width of its container, so the same component
 * works for small grid cards and the large preview.
 */
export default function TemplatePreview({
  template,
  profile,
  customization,
  live = false,
  decorative = false,
  activeTab = 'home',
  onTabChange,
}) {
  const { style: s, iconStyle } = applyCustomization(template, customization || {});
  const [internalTab, setInternalTab] = useState('home');
  const p = profile || {};
  const selectedTab = onTabChange ? activeTab : internalTab;
  const changeTab = onTabChange || setInternalTab;
  const name = p.full_name || 'Your Name';
  const socials = p.socials || [];
  const links = (p.links || []).filter((l) => l.is_active !== false);
  const displayedLinks = live ? links : links.slice(0, 6);
  const gallery = Array.isArray(p.gallery) ? p.gallery : [];
  const portfolioLayout = live && (
    template.tier !== 'starter' || p.plan_tier === 'standard' || p.plan_tier === 'pro'
  );
  const category = typeof p.category === 'string'
    ? p.category.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
    : '';
  const renderSocials = (items) => items.length > 0 && (
    <div className="tpl__icons">
      {items.map((social, index) => (
        <a
          key={`${social.platform}-${index}`}
          className="tpl__icon"
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.platform}
        >
          <LinkIcon
            icon={social.platform === 'other' ? 'other' : social.platform}
            width="1.25em"
            height="1.25em"
          />
        </a>
      ))}
    </div>
  );

  const src = photoSrc(p.photo_url);
  const coverSrc = portfolioLayout ? photoSrc(p.cover_url) : '';

  const vars = {
    '--t-bg': s.bg,
    '--t-fg': s.fg,
    '--t-muted': s.muted,
    '--t-font': s.font,
    '--t-banner': s.banner,
    '--t-card': s.card,
    '--t-btn-bg': s.btnBg,
    '--t-btn-fg': s.btnFg,
    '--t-btn-border': s.btnBorder,
    '--t-btn-radius': s.btnRadius,
    '--t-btn-shadow': s.btnShadow,
    '--t-icon-bg': s.iconBg,
    '--t-icon-fg': s.iconFg,
    '--t-ring': s.ring,
    '--t-accent': s.accent,
    '--t-accent-fg': s.accentFg,
    '--t-brand': s.brand,
    '--t-cover-image': coverSrc ? `url("${coverSrc}")` : 'none',
    '--t-bg-image': s.bgImageUrl ? `url(${photoSrc(s.bgImageUrl)})` : 'none',
    '--t-bg-overlay': typeof s.bgOverlay === 'number' ? s.bgOverlay / 100 : 0,
  };

  return (
    <div
      className="tpl"
      data-layout={s.layout}
      data-tier={template.tier}
      data-plan-tier={p.plan_tier || 'free'}
      data-avatar={s.avatar}
      data-links={s.linkLayout}
      data-name-style={s.nameStyle}
      data-iconstyle={iconStyle}
      data-hasbg={s.bgImageUrl ? 'true' : undefined}
      data-live={live ? 'true' : undefined}
      style={vars}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <div className="tpl__screen">
        {(s.layout === 'banner' || portfolioLayout) && (
          <div className="tpl__banner" data-has-cover={coverSrc ? 'true' : undefined} />
        )}

        <div className="tpl__body">
          <div className="tpl__avatar">
            {src ? <img src={src} alt={decorative ? '' : name} /> : <span>{initials(name)}</span>}
          </div>

          <p className="tpl__name">{name}</p>
          {p.username && <p className="tpl__user">@{p.username}</p>}
          {live ? (
            <>
              {selectedTab === 'home' && (
                <div className="tpl__tab-content">
                  {category && <p className="tpl__role">{category}</p>}
                  {p.location && <p className="tpl__loc">{p.location}</p>}
                  {portfolioLayout && renderSocials(socials)}
                  {displayedLinks.length > 0 && (
                    <div className="tpl__links">
                      {displayedLinks.map((l) => {
                        const content = (
                          <>
                            <span className="tpl__btn-icon">
                              <LinkIcon icon={l.icon} width="1.1em" height="1.1em" />
                            </span>
                            <span className="tpl__btn-label">{l.label}</span>
                          </>
                        );
                        return l.url ? (
                          <a key={l.id || l.label} className="tpl__btn" href={l.url} target="_blank" rel="noopener noreferrer">
                            {content}
                          </a>
                        ) : (
                          <div className="tpl__btn" key={l.id || l.label}>
                            {content}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {!portfolioLayout && renderSocials(socials)}
                  {!displayedLinks.length && !socials.length && (
                    <p className="tpl__empty">No links added yet.</p>
                  )}
                </div>
              )}
              {selectedTab === 'gallery' && (
                <div className="tpl__tab-content tpl__gallery">
                  {gallery.length ? (
                    <div className="tpl__gallery-grid">
                      {gallery.map((image) => (
                        <img
                          key={image.id || image.image_url}
                          src={photoSrc(image.image_url)}
                          alt={`${name} gallery`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="tpl__empty">Gallery photos will appear here.</p>
                  )}
                </div>
              )}
              {selectedTab === 'about' && (
                <div className="tpl__tab-content tpl__about">
                  {category && <p className="tpl__role">{category}</p>}
                  {p.bio ? <p className="tpl__about-bio">{p.bio}</p> : (
                    <p className="tpl__empty">No about information added yet.</p>
                  )}
                  {p.location && <p className="tpl__loc">{p.location}</p>}
                </div>
              )}
            </>
          ) : (
            <>
              {p.bio && <p className="tpl__bio">{p.bio}</p>}
              {p.location && <p className="tpl__loc">{p.location}</p>}
              {displayedLinks.length > 0 && (
                <div className="tpl__links">
                  {displayedLinks.map((l) => (
                    <div className="tpl__btn" key={l.id || l.label}>
                      <span className="tpl__btn-icon">
                        <LinkIcon icon={l.icon} width="1.1em" height="1.1em" />
                      </span>
                      <span className="tpl__btn-label">{l.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {socials.length > 0 && (
                <div className="tpl__icons">
                  {socials.map((social, index) => (
                    <span className="tpl__icon" key={`${social.platform}-${index}`}>
                      <LinkIcon
                        icon={social.platform === 'other' ? 'other' : social.platform}
                        width="1.25em"
                        height="1.25em"
                      />
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <p className="tpl__brand">mlink.com/{p.username || 'yourname'}</p>
        {live && (
          <nav className="tpl__tabs" role="tablist" aria-label="Profile sections">
            {['home', 'gallery', 'about'].map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={selectedTab === tab}
                onClick={() => changeTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}