import { Heading } from '@chakra-ui/react';
import Home from './pages/Home';
import ElderlyDashboard from './pages/Elderly/ElderlyDashboard.jsx';
import CaregiverDashboard from './pages/Caregiver/CaregiverDashboard.jsx';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ElderlyRegisteredEvents from './pages/Elderly/ElderlyRegisteredEvents.jsx';
import ElderlyHistoryEvents from './pages/Elderly/ElderlyHIstoryEvents.jsx';

function ElderlyRouteWrapper() {
  const { userId } = useParams();
  return <ElderlyDashboard userId={userId} />;
}

function ElderlyRegisteredEventsRouteWrapper() {
  const { userId } = useParams();
  return <ElderlyRegisteredEvents userId={userId} />;
}

function ElderlyHistoryRouteWrapper() {
  const { userId } = useParams();
  return <ElderlyHistoryEvents userId={userId} />;
}

function CaregiverRouteWrapper() {
  const { userId } = useParams();
  return <CaregiverDashboard userId={userId} />;
}

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/elderly/:userId/dashboard" element={<ElderlyRouteWrapper />} />
            <Route path="/elderly/:userId/dashboard/registeredevents" element={<ElderlyRegisteredEventsRouteWrapper />} />
            <Route path="/elderly/:userId/dashboard/history" element={<ElderlyHistoryRouteWrapper />} />
          <Route path="/caregiver/:userId/dashboard" element={<CaregiverRouteWrapper />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
