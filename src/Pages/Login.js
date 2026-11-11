import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE from "../Api/apiConfig";
import "../Style/Login.css";

const AUTH_API = `${API_BASE}/api/auth`;

/* ---------- Inline icons (no external icon package needed) ---------- */
const MailIcon = () => (
  <svg className="field-icon" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path 
      d="M4 6.5l8 6.2 8-6.2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"    
    />
  </svg>
  
);

const LockIcon = () => (
  <svg className="field-icon" viewBox="0 0 24 24" fill="none">
    <rect
      x="4.5"
      y="10.5"
      width="15"
      height="9.5"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M8 10.5V7.8a4 4 0 118 0v2.7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg className="field-icon" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M4.5 19.2c1.4-3.3 4.2-5 7.5-5s6.1 1.7 7.5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const EyeIcon = () => (
  <svg className="toggle-icon" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="toggle-icon" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 3l18 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />  
    <path
      d="M10.6 5.7C11 5.6 11.5 5.5 12 5.5c6.4 0 10 6.5 10 6.5a15 15 0 01-3.4 4.1M6.5 7.1A15.3 15.3 0 002 12s3.6 6.5 10 6.5c1.3 0 2.5-.2 3.6-.7M9.9 9.9a3 3 0 004.2 4.2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Strips anything that isn't valid in an email, forces lowercase, blocks spaces */
const sanitizeEmail = (value) =>
  value.toLowerCase().replace(/\s/g, "").replace(/[^a-z0-9@._+-]/g, "");

const isValidEmail = (value) => /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);

/*
  Props (both optional, so this component still works as a standalone page
  if you ever want to route to it directly):
  - embedded: true when rendered inside the Hero modal — skips the
    full-page ".auth-page" wrapper so it just fills the modal box.
  - initialMode: "signin" | "signup" — which side opens first.
  - onLoginSuccess: called after a successful sign-in, before the modal
    closes. Use this to move the app to the next screen (e.g. Pricing).
  - onClose: called to dismiss the modal. Also used as a fallback if
    onLoginSuccess isn't provided.
*/
function Login({ embedded = false, initialMode = "signin", onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");

  const [signInData, setSignInData] = useState({ identifier: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [showSignInPw, setShowSignInPw] = useState(false);
  const [showSignUpPw, setShowSignUpPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData({
      ...signInData,
      [name]: name === "identifier" ? value.toLowerCase() : value,
    });
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: name === "email" ? sanitizeEmail(value) : value,
    });
  };

  /* Blocks the browser from offering/filling saved credentials on mount;
     field becomes editable the moment the user actually focuses it. */
  const blockAutofill = (e) => e.target.removeAttribute("readOnly");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!signInData.identifier.trim()) {
      setError("Enter your registered email or mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: signInData.identifier.trim(),
          password: signInData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (onLoginSuccess) onLoginSuccess();
      else if (onClose) onClose();
    } catch (err) {
      setError("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(signUpData.email)) {
      setError("Enter a valid email address");
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          phone: signUpData.phone,
          password: signUpData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.verificationPending) {
          setVerificationEmail(signUpData.email);
          setVerificationCode("");
        }
        setError(data.message || "Registration failed");
        return;
      }

      setVerificationEmail(data.email || signUpData.email);
      setVerificationCode("");
    } catch (err) {
      setError("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verificationEmail, code: verificationCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Email verification failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (onLoginSuccess) onLoginSuccess({ createdAccount: true });
      else if (onClose) onClose();
    } catch (err) {
      setError("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verificationEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Could not resend the verification code");
        return;
      }
      setError(data.message || "A new verification code has been sent.");
    } catch (err) {
      setError("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (toSignUp) => {
    setError("");
    setVerificationEmail("");
    setVerificationCode("");
    setIsSignUp(toSignUp);
  };

  const authCard = (
    <div className={`auth-card ${isSignUp ? "right-panel-active" : ""}`}>
      {/* SIGN UP FORM */}
      <div className="form-container sign-up-container">
        <form
          onSubmit={verificationEmail ? handleVerifyEmail : handleSignUp}
          className="auth-form"
          autoComplete="off"
        >
          <Link to="/" className="auth-brand" aria-label="MLink home" onClick={onClose}>
            MLink
          </Link>
          {verificationEmail ? (
            <>
              <h1 className="auth-title">Verify your email</h1>
              <p className="auth-subtitle">
                Enter the six-digit code sent to {verificationEmail}. Your one-day free trial starts after verification.
              </p>
              <div className="input-group">
                <label htmlFor="email-verification-code">Email verification code</label>
                <div className="input-wrapper">
                  <MailIcon />
                  <input
                    type="text"
                    id="email-verification-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                  />
                </div>
              </div>
              {error && <p className="auth-error" role="status">{error}</p>}
              <button type="submit" className="auth-btn" disabled={loading || verificationCode.length !== 6}>
                {loading ? "Verifying..." : "Verify email & start trial"}
              </button>
              <button
                type="button"
                className="auth-resend-btn"
                onClick={handleResendVerification}
                disabled={loading}
              >
                Resend verification code
              </button>
            </>
          ) : (
            <>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Explore all MLink features free for one day after verifying your email</p>

              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <UserIcon />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={signUpData.name}
                    onChange={handleSignUpChange}
                    autoComplete="off"
                    readOnly
                    onFocus={blockAutofill}
                    required
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="signup-email">Email</label>
                <div className="input-wrapper">
                  <MailIcon />
                  <input
                    type="text"
                    inputMode="email"
                    id="signup-email"
                    name="email"
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={handleSignUpChange}
                    autoComplete="off"
                    readOnly
                    onFocus={blockAutofill}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="signup-phone">Mobile number</label>
                <div className="input-wrapper">
                  <UserIcon />
                  <input
                    type="tel"
                    inputMode="tel"
                    id="signup-phone"
                    name="phone"
                    placeholder="Enter your mobile number"
                    value={signUpData.phone}
                    onChange={handleSignUpChange}
                    autoComplete="tel"
                    required
                    maxLength={30}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="signup-password">Password</label>
                <div className="input-wrapper">
                  <LockIcon />
                  <input
                    type={showSignUpPw ? "text" : "password"}
                    id="signup-password"
                    name="password"
                    placeholder="Enter your password"
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    autoComplete="new-password"
                    readOnly
                    onFocus={blockAutofill}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    tabIndex={-1}
                    onClick={() => setShowSignUpPw((v) => !v)}
                    aria-label={showSignUpPw ? "Hide password" : "Show password"}
                  >
                    {showSignUpPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <LockIcon />
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={handleSignUpChange}
                    autoComplete="new-password"
                    readOnly
                    onFocus={blockAutofill}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPw((v) => !v)}
                    aria-label={showConfirmPw ? "Hide password" : "Show password"}
                  >
                    {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Sending verification code..." : "Continue with email verification"}
              </button>
            </>
          )}
        </form>
      </div>

      {/* SIGN IN FORM */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleSignIn} className="auth-form" autoComplete="off">
          <Link to="/" className="auth-brand" aria-label="MLink home" onClick={onClose}>
            MLink
          </Link>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Sign in with your email or mobile number</p>

          <div className="input-group">
            <label htmlFor="login-identifier">Email or mobile number</label>
            <div className="input-wrapper">
              <MailIcon />
              <input
                type="text"
                id="login-identifier"
                name="identifier"
                placeholder="Enter your email or mobile number"
                value={signInData.identifier}
                onChange={handleSignInChange}
                autoComplete="username"
                readOnly
                onFocus={blockAutofill}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <LockIcon />
              <input
                type={showSignInPw ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={signInData.password}
                onChange={handleSignInChange}
                autoComplete="current-password"
                readOnly
                onFocus={blockAutofill}
                required
              />
              <button
                type="button"
                className="eye-btn"
                tabIndex={-1}
                onClick={() => setShowSignInPw((v) => !v)}
                aria-label={showSignInPw ? "Hide password" : "Show password"}
              >
                {showSignInPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="button" className="auth-forgot">
            Forgot your password?
          </button>

          {!isSignUp && error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* SLIDING RED OVERLAY */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1 className="overlay-title">Welcome Back</h1>
            <p className="overlay-text">
              Already have an account? Sign in to continue to MLink
            </p>
            <button type="button" className="ghost-btn" onClick={() => switchMode(false)}>
              Sign In
            </button>
          </div>

          <div className="overlay-panel overlay-right">
            <h1 className="overlay-title">Hello Friend</h1>
            <p className="overlay-text">Sign up now and enjoy our site</p>
            <button type="button" className="ghost-btn" onClick={() => switchMode(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return authCard;
  }

  return <div className="auth-page">{authCard}</div>;
}

export default Login;