import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPage";
import DigitalSuperpowerQuiz from "./pages/DigitalSuperpowerQuiz";
import AssistantPage from "./pages/AssistantPage";
import ThankYouCalculatorPage from "./pages/ThankYouCalculatorPage";
import IntelligencePage from "./pages/IntelligencePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ChatWidget from "./components/ChatWidget";
import ScrollProgress from "./components/ScrollProgress";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PremiumGate from "./components/PremiumGate";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

function App() {
  const hostname = window.location.hostname;
  const isDashboardDomain = hostname === "dashboard.digitallydefined.online";

  const homePage = isDashboardDomain ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <LandingPage />
  );

  return (
    <>
      <SpeedInsights />
      <ScrollProgress />

      {/* Show chat ONLY on the main site */}
      {!isDashboardDomain && <ChatWidget />}

      <Routes>
        <Route path="/" element={homePage} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/quiz" element={<DigitalSuperpowerQuiz />} />
        <Route path="/automations" element={<AssistantPage />} />
        <Route path="/thank-you-calculator" element={<ThankYouCalculatorPage />} />
        <Route
          path="/intelligence"
          element={
            <ProtectedRoute>
              <PremiumGate feature="Intelligence">
                <IntelligencePage />
              </PremiumGate>
            </ProtectedRoute>
          }
        />

        {/* ⭐ Live website analytics (AI Business Partner data source) */}
        {isDashboardDomain && (
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
        )}

        {/* ⭐ NEW: AI Assistant Page (dashboard only) */}
        {isDashboardDomain && (
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <PremiumGate feature="AI Business Partner">
                  <AssistantPage />
                </PremiumGate>
              </ProtectedRoute>
            }
          />
        )}

        <Route
          path="*"
          element={
            isDashboardDomain ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;