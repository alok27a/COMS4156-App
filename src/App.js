import { Heading } from '@chakra-ui/react';
import Home from './pages/Home';
import ElderlyDashboard from './pages/Elderly/ElderlyDashboard.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/elderly/dashboard" element={<ElderlyDashboard />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
