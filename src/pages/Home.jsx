import React from "react";
import { FaBriefcaseMedical, FaLock, FaMousePointer } from "react-icons/fa";

import Hero from "../components/Hero";
import Navbar from "../components/Utility/Navbar";
import Footer from "../components/Utility/Footer";
import { Container } from "@chakra-ui/react";

const Home = () => {
  const icons = [FaBriefcaseMedical, FaLock, FaMousePointer];
  return (
    <>
    <Container maxW="container.xxl">
        <Navbar/>
        <Hero />
    </Container>
    </>
  );
};

export default Home;