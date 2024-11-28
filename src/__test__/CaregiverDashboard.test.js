import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, useParams } from "react-router-dom";
import Dashboard from "../pages/Caregiver/CaregiverDashboard"; // Adjust the path based on your file structure
import { ChakraProvider, useDisclosure, useToast } from "@chakra-ui/react";
import fetchMock from "jest-fetch-mock";

// Mock matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// Mock Chakra UI hooks
jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: jest.fn(),
    useDisclosure: jest.fn(),
  };
});

// Mock `useParams`
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

const mockToast = jest.fn();

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <Dashboard />
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe("Dashboard Component", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
    useParams.mockReturnValue({ userId: '123' });
    useDisclosure.mockReturnValue({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
    });
    useToast.mockReturnValue(mockToast);
  });

  it("opens the create event modal when the button is clicked", () => {
    const onOpenMock = jest.fn();
    useDisclosure.mockReturnValue({
      isOpen: false,
      onOpen: onOpenMock,
      onClose: jest.fn(),
    });

    renderDashboard();

    const createEventButton = screen.getByText("Create Event");
    fireEvent.click(createEventButton);

    expect(onOpenMock).toHaveBeenCalled();
  });

  it('renders the dashboard with a different userId', () => {
    useParams.mockReturnValue({ userId: '456' });
    renderDashboard();
    // Add assertions here to check if the dashboard renders correctly with the new userId
  });
});