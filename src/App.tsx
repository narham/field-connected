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
import SSBTraining from "./pages/ssb/SSBTraining";
import SSBPayments from "./pages/ssb/SSBPayments";
import SSBMore from "./pages/ssb/SSBMore";

import EOLayout from "./components/layout/EOLayout";
import EODashboard from "./pages/eo/EODashboard";
import EOCompetitions from "./pages/eo/EOCompetitions";
import EORegistrations from "./pages/eo/EORegistrations";
import EOMatches from "./pages/eo/EOMatches";
import EOStandings from "./pages/eo/EOStandings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* SSB Routes */}
          <Route path="/ssb" element={<SSBLayout />}>
            <Route index element={<SSBDashboard />} />
            <Route path="players" element={<SSBPlayers />} />
            <Route path="training" element={<SSBTraining />} />
            <Route path="payments" element={<SSBPayments />} />
            <Route path="more" element={<SSBMore />} />
          </Route>

          {/* EO Routes */}
          <Route path="/eo" element={<EOLayout />}>
            <Route index element={<EODashboard />} />
            <Route path="competitions" element={<EOCompetitions />} />
            <Route path="registrations" element={<EORegistrations />} />
            <Route path="matches" element={<EOMatches />} />
            <Route path="standings" element={<EOStandings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
