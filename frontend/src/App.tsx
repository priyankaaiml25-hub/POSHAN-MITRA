import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { OfflineStatusBanner } from './components/common/OfflineStatusBanner';

// Pages
import { HomePage } from './pages/HomePage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { NutritionEducationPage } from './pages/NutritionEducationPage';
import { FoodGuidePage } from './pages/FoodGuidePage';
import { MealPlannerPage } from './pages/MealPlannerPage';
import { PoshanPlayPage } from './pages/PoshanPlayPage';
import { GrowthMonitoringPage } from './pages/GrowthMonitoringPage';
import { FollowUpTrackerPage } from './pages/FollowUpTrackerPage';
import { ParentResourcesPage } from './pages/ParentResourcesPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { CommunityImpactPage } from './pages/CommunityImpactPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-warm-50 text-slate-800 font-sans">
            <OfflineStatusBanner />
            <DisclaimerBanner />
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<WorkerDashboardPage />} />
                <Route path="/education" element={<NutritionEducationPage />} />
                <Route path="/food-guide" element={<FoodGuidePage />} />
                <Route path="/meal-planner" element={<MealPlannerPage />} />
                <Route path="/poshan-play" element={<PoshanPlayPage />} />
                <Route path="/growth-monitoring" element={<GrowthMonitoringPage />} />
                <Route path="/follow-ups" element={<FollowUpTrackerPage />} />
                <Route path="/parent-resources" element={<ParentResourcesPage />} />
                <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
                <Route path="/impact-reports" element={<CommunityImpactPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
