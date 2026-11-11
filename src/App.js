import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Footer from "./Components/Footer";
import Pricing from "./Pages/Pricing";
import Dashboard from "./Components/Dashboard";
import ProfileWizard from "./Pages/ProfileWizard";
import Templates from "./Pages/Templates";
import AddLinks from "./Pages/AddLinks";
import Customize from "./Pages/Customize";
import Preview from "./Pages/Preview";
import PublicProfile from "./Pages/PublicProfile";
import PolicyPage from "./Pages/PolicyPage";
import Login from "./Pages/Login";
import Toast from "./Components/Toast";
import TrialCountdown from "./Components/TrialCountdown";
import "./Style/Hero.css"; // auth-modal-overlay / auth-modal-box / auth-modal-close live here
import "./Style/ScreenTransition.css";
import "./Style/InterfacePolish.css";
import "./Style/HomepagePolish.css";
import "./App.css";

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ROUTES = {
  home: "/",
  pricing: "/pricing",
  dashboard: "/dashboard",
  profile: "/profile",
  templates: "/templates",
  addlinks: "/add-links",
  customize: "/customize",
  preview: "/preview",
};

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(readUser);
  const [toastMessage, setToastMessage] = useState(null);

  // --- Centralized login/signup popup state ---
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [closing, setClosing] = useState(false);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setClosing(false);
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setClosing(true);
    setTimeout(() => {
      setAuthOpen(false);
      setClosing(false);
    }, 280);
  };

  useEffect(() => {
    document.body.style.overflow = authOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [authOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    if (!authOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeAuth();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authOpen]);

    // Signed-out visitors who open an app screen get the Sign in popup instead.
  useEffect(() => {
    const protectedPaths = [
      ROUTES.pricing,
      ROUTES.dashboard,
      ROUTES.profile,
      ROUTES.templates,
      ROUTES.addlinks,
      ROUTES.customize,
      ROUTES.preview,
    ];
    if (protectedPaths.includes(pathname) && !localStorage.getItem("token")) {
      navigate(ROUTES.home, { replace: true });
      openAuth("signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLoginSuccess = ({ createdAccount = false } = {}) => {
    closeAuth();
    setUser(readUser());
    setToastMessage(createdAccount ? "Email verified! Your one-day free trial is active." : "Signed in successfully!");
    setTimeout(() => navigate(ROUTES.dashboard), 1100);
  };

  const handlePlanActivated = () => navigate(ROUTES.dashboard, { replace: true });
  const handleChangePlan = () => {
    try {
      sessionStorage.setItem("mlink_changing_plan", "1");
    } catch {
      /* ignore */
    }
    navigate(ROUTES.pricing);
  };
  const handleOpenPricing = () => navigate(ROUTES.pricing);
  const handleOpenDashboard = () => navigate(ROUTES.dashboard);
  const handleOpenProfile = () => navigate(ROUTES.profile);
  const handleBackToDashboard = () => navigate(ROUTES.dashboard);
  const handleProfileFinished = () => navigate(ROUTES.templates);

  const handleUpgradeFromTemplates = handleChangePlan;

  const handleTemplateChosen = () => navigate(ROUTES.addlinks);
  const handleLinksDone = () => navigate(ROUTES.customize);
  const handleCustomizeDone = () => navigate(ROUTES.preview);
  const handleBackToHome = () => navigate(ROUTES.home);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("mlink_subscription");
    setUser(null);
    navigate(ROUTES.home);
  };

  const renderScreen = (content) => (
    <div className="app-screen" key={pathname}>
      {content}
    </div>
  );
  const homeScreen = renderScreen(
    <div className="App">
      <Homepage
        onOpenAuth={openAuth}
        activeAuthMode={authOpen ? authMode : null}
        user={user}
        onProfileClick={handleOpenDashboard}
      />
      <Footer />
    </div>
  );

  return (
    <>
      <TrialCountdown
        user={user}
        pathname={pathname}
        onChoosePlan={handleChangePlan}
      />
      <Routes>
        <Route path="/" element={homeScreen} />
        <Route
          path="/pricing"
          element={renderScreen(
            <Pricing
              onBack={handleBackToHome}
              onLogout={handleLogout}
              onPlanActivated={handlePlanActivated}
            />
          )}
        />
        <Route
          path="/dashboard"
          element={renderScreen(
            <Dashboard
              onChangePlan={handleChangePlan}
              onLogout={handleLogout}
              onOpenProfile={handleOpenProfile}
            />
          )}
        />
        <Route
          path="/profile"
          element={renderScreen(
            <ProfileWizard
              onBack={handleBackToDashboard}
              onFinish={handleProfileFinished}
            />
          )}
        />
        <Route
          path="/templates"
          element={renderScreen(
            <Templates
              onBack={handleBackToDashboard}
              onContinue={handleTemplateChosen}
              onUpgrade={handleUpgradeFromTemplates}
            />
          )}
        />
        <Route
          path="/add-links"
          element={renderScreen(
            <AddLinks
              onBack={() => navigate(ROUTES.templates)}
              onContinue={handleLinksDone}
            />
          )}
        />
        <Route
          path="/customize"
          element={renderScreen(
            <Customize
              onBack={() => navigate(ROUTES.addlinks)}
              onContinue={handleCustomizeDone}
              onUpgrade={handleUpgradeFromTemplates}
            />
          )}
        />
        <Route
          path="/preview"
          element={renderScreen(
            <Preview
              onBack={() => navigate(ROUTES.customize)}
              onEditLinks={() => navigate(ROUTES.addlinks)}
              onEditCustomize={() => navigate(ROUTES.customize)}
              onUpgrade={handleUpgradeFromTemplates}
            />
          )}
        />
        <Route path="/about" element={renderScreen(<><PolicyPage page="about" /><Footer /></>)} />
        <Route path="/services" element={renderScreen(<><PolicyPage page="services" /><Footer /></>)} />
        <Route path="/terms" element={renderScreen(<><PolicyPage page="terms" /><Footer /></>)} />
        <Route path="/privacy" element={renderScreen(<><PolicyPage page="privacy" /><Footer /></>)} />
        <Route
          path="/cancellation-refund"
          element={renderScreen(<><PolicyPage page="cancellation-refund" /><Footer /></>)}
        />
        <Route
          path="/shipping-delivery"
          element={renderScreen(<><PolicyPage page="shipping-delivery" /><Footer /></>)}
        />
        <Route path="/disclaimer" element={renderScreen(<><PolicyPage page="disclaimer" /><Footer /></>)} />
        <Route path="/contact" element={renderScreen(<><PolicyPage page="contact" /><Footer /></>)} />
        <Route path="/:username" element={<PublicProfileRoute fallback={homeScreen} />} />
        <Route path="*" element={homeScreen} />
      </Routes>

      {/* Rendered as a direct sibling of .app-screen, never inside it —
          so no transform/animation on any screen can ever turn this
          position:fixed overlay into a relatively-positioned one. */}
      {authOpen && (
        <div
          className={`auth-modal-overlay ${closing ? "closing" : ""}`}
          onClick={closeAuth}
        >
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="auth-modal-close"
              onClick={closeAuth}
              aria-label="Close login form"
            >
              ×
            </button>

            <Login
              embedded
              initialMode={authMode}
              onClose={closeAuth}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      )}

      <Toast message={toastMessage} onDone={() => setToastMessage(null)} />
    </>
  );
}

function PublicProfileRoute({ fallback }) {
  const { username } = useParams();
  if (!username || !/^[a-z0-9_]{3,30}$/i.test(username)) {
    return fallback;
  }
  return <PublicProfile username={username.toLowerCase()} />;
}

export default App;