import { Heading } from '@chakra-ui/react';
import Home from './pages/Home';
import ElderlyDashboard from './pages/Elderly/ElderlyDashboard.jsx';
import CaregiverDashboard from './pages/Caregiver/CaregiverDashboard.jsx';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ElderlyRegisteredEvents from './pages/Elderly/ElderlyRegisteredEvents.jsx';
import ElderlyHistoryEvents from './pages/Elderly/ElderlyHIstoryEvents.jsx';

import CaregiverRegisteredEvents from './pages/Caregiver/CaregiverRegisteredEvents.jsx';
import CaregiverTaskAssigned from './pages/Caregiver/CaregiverTaskAssigned.jsx';
import CaregiverHistory from './pages/Caregiver/CaregiverHistory.jsx';


// Elderly Route Wrapper
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


// Caregiver Route Wrapper
function CaregiverRouteWrapper() {
  const { userId } = useParams();
  return <CaregiverDashboard userId={userId} />;
}


function CaregiverRegisteredEventsRouteWrapper() {
  const { userId } = useParams();
  return <CaregiverRegisteredEvents userId={userId} />;
}

function CaregiverTaskAssignedRouteWrapper() {
  const { userId } = useParams();
  return <CaregiverTaskAssigned userId={userId} />;
}

function CaregiverHistoryRouteWrapper() {
  const { userId } = useParams();
  return <CaregiverHistory userId={userId} />;
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
          <Route path="/caregiver/:userId/dashboard/registeredevents" element={<CaregiverRegisteredEventsRouteWrapper />} />
          <Route path="/caregiver/:userId/dashboard/taskassigned" element={<CaregiverTaskAssignedRouteWrapper />} />
          <Route path="/caregiver/:userId/dashboard/history" element={<CaregiverHistoryRouteWrapper />} />
        
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
