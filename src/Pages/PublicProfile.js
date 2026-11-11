import React, { useEffect, useState } from 'react';
import { fetchPublicProfile } from '../Api/PublicApi';
import { getTemplate } from '../Data/templates';
import TemplatePreview from '../Components/TemplatePreview';
import '../Style/PublicProfile.css';

export default function PublicProfile({ username }) {
  const [profile, setProfile] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    let off = false;
    setLoading(true);
    setProfile(null);
    setNotFound(false);
    setActiveTab('home');
    (async () => {
      try {
        const p = await fetchPublicProfile(username);
        if (!off) setProfile(p);
      } catch {
        if (!off) setNotFound(true);
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => {
      off = true;
    };
  }, [username]);

  useEffect(() => {
    setActiveTab('home');
  }, [username]);

  useEffect(() => {
    const title = profile
      ? `${profile.full_name || profile.username} | MLink`
      : notFound
        ? 'Page not found | MLink'
        : 'MLink | Digital Profile';
    const description = profile && profile.bio
      ? profile.bio.replace(/\s+/g, ' ').trim().slice(0, 160)
      : 'A professional profile with links, social pages, a gallery and about information.';

    document.title = title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute('content', description);

    return () => {
      document.title = 'MLink | Digital Profiles';
      if (descriptionTag) {
        descriptionTag.setAttribute(
          'content',
          'Create a professional profile with all your links in one place.'
        );
      }
    };
  }, [profile, notFound]);

  if (loading) {
    return (
      <div className="pub">
        <p className="pub__msg">Loading…</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="pub">
        <div className="pub__notfound">
          <p className="pub__notfound-title">This page isn&rsquo;t available</p>
          <p className="pub__notfound-text">
            The link may be incorrect, or this page hasn&rsquo;t been published yet.
          </p>
        </div>
      </div>
    );
  }

  const template = getTemplate(profile.template_id) || getTemplate('other-01');

  return (
    <div className="pub">
      <div className="pub__phone">
        <TemplatePreview
          template={template}
          profile={profile}
          customization={profile.customization}
          live
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}