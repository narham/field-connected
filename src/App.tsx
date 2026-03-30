import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import SSBLayout from "./components/layout/SSBLayout";
import SSBDashboard from "./pages/ssb/SSBDashboard";
import SSBPlayers from "./pages/ssb/SSBPlayers";
import SSBPlayerDetail from "./pages/ssb/SSBPlayerDetail";
import SSBTraining from "./pages/ssb/SSBTraining";
import SSBPayments from "./pages/ssb/SSBPayments";
import SSBMore from "./pages/ssb/SSBMore";
import SSBCoachManagement from "./pages/ssb/SSBCoachManagement";
import SSBCompetitions from "./pages/ssb/SSBCompetitions";
import SSBCompetitionDetail from "./pages/ssb/SSBCompetitionDetail";
import SSBCompetitionRegister from "./pages/ssb/SSBCompetitionRegister";
import SSBRegistrations from "./pages/ssb/SSBRegistrations";
import SSBAttendance from "./pages/ssb/SSBAttendance";

import EOLayout from "./components/layout/EOLayout";
import CoachLayout from "./components/layout/CoachLayout";
import CoachDashboard from "./pages/coach/CoachDashboard";
import CoachRoster from "./pages/coach/CoachRoster";
import CoachProfile from "./pages/coach/CoachProfile";
import CoachSchedule from "./pages/coach/CoachSchedule";
import CoachAttendance from "./pages/coach/CoachAttendance";
import EODashboard from "./pages/eo/EODashboard";
import EOCompetitions from "./pages/eo/EOCompetitions";
import EORegistrations from "./pages/eo/EORegistrations";
import EORegistrationDetail from "./pages/eo/EORegistrationDetail";
import EOMatches from "./pages/eo/EOMatches";
import EOMatchDetail from "./pages/eo/EOMatchDetail";
import EOStandings from "./pages/eo/EOStandings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* SSB Routes */}
          <Route path="/ssb" element={<SSBLayout />}>
            <Route index element={<SSBDashboard />} />
            <Route path="players" element={<SSBPlayers />} />
            <Route path="players/:id" element={<SSBPlayerDetail />} />
            <Route path="training" element={<SSBTraining />} />
            <Route path="training/attendance/:sessionId" element={<SSBAttendance />} />
            <Route path="payments" element={<SSBPayments />} />
            <Route path="more" element={<SSBMore />} />
            <Route path="coaches" element={<SSBCoachManagement />} />
            <Route path="competitions" element={<SSBCompetitions />} />
            <Route path="competitions/:id" element={<SSBCompetitionDetail />} />
            <Route path="competitions/:id/register" element={<SSBCompetitionRegister />} />
            <Route path="registrations" element={<SSBRegistrations />} />
          </Route>

          {/* EO Routes */}
          <Route path="/eo" element={<EOLayout />}>
            <Route index element={<EODashboard />} />
            <Route path="competitions" element={<EOCompetitions />} />
            <Route path="registrations" element={<EORegistrations />} />
            <Route path="registrations/:id" element={<EORegistrationDetail />} />
            <Route path="matches" element={<EOMatches />} />
            <Route path="matches/:id" element={<EOMatchDetail />} />
            <Route path="standings" element={<EOStandings />} />
          </Route>

          {/* Coach Routes */}
          <Route path="/coach" element={<CoachLayout />}>
            <Route index element={<CoachDashboard />} />
            <Route path="roster" element={<CoachRoster />} />
            <Route path="schedule" element={<CoachSchedule />} />
            <Route path="attendance/:sessionId" element={<CoachAttendance />} />
            <Route path="profile" element={<CoachProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
