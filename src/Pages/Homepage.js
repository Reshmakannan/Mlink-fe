import React from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import TemplateShowcase from "../Components/TemplateShowcase";
import CreateCustomize from "../Components/Createcustmoise";
import LinkShareSection from "../Components/Linkshare";
import AnalyticsSection from "../Components/Analytic";
import ClosingCtaSection from "../Components/Closing";
import FaqSection from "../Components/Faq";
import CursorSparkles from "../Components/Cursorsparkles";
import "../Style/Cartoon.css"; // keep this the LAST import

function Homepage({ onOpenAuth, activeAuthMode, user, onProfileClick }) {
  return (
    <>
      <Navbar
        onSignIn={() => onOpenAuth("signin")}
        onSignUp={() => onOpenAuth("signup")}
        activeButton={activeAuthMode}
        user={user}
        onProfileClick={onProfileClick}
      />
      <Hero onOpenAuth={onOpenAuth} />
      <CreateCustomize onOpenAuth={onOpenAuth} />
      <LinkShareSection onOpenAuth={onOpenAuth} />
      <TemplateShowcase />
      <AnalyticsSection onOpenAuth={onOpenAuth} />
      <ClosingCtaSection />
      <FaqSection />
      <CursorSparkles />
    </>
  );
}

export default Homepage;