/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../pages/Elderly/ElderlyDashboard';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

// Mock the dependencies
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: jest.fn(),
}));

// Mock fetch function
global.fetch = jest.fn();

describe('Dashboard Component', () => {
  const mockUserId = '123';
  const mockToast = jest.fn();
  const mockEvents = [
    {
      id: '1',
      name: 'Test Event 1',
      description: 'Description 1',
      location: 'Location 1',
      date: '2023-12-01',
      time: '14:00',
      host: { firstName: 'John', lastName: 'Doe' },
      images: [{ url: 'https://example.com/image1.jpg' }],
    },
    {
      id: '2',
      name: 'Test Event 2',
      description: 'Description 2',
      location: 'Location 2',
      date: '2023-12-02',
      time: '15:00',
      host: { firstName: 'Jane', lastName: 'Smith' },
      images: [],
    },
  ];

  beforeEach(() => {
    useParams.mockReturnValue({ userId: mockUserId });
    useToast.mockReturnValue(mockToast);
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockEvents }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with events', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Welcome to Your Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });
  });

  test('filters events by search term', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search events by name...');
    fireEvent.change(searchInput, { target: { value: 'Event 1' } });

    expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Event 2')).not.toBeInTheDocument();
  });

  test('filters events by location', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });

    const locationInput = screen.getByPlaceholderText('Filter by location...');
    fireEvent.change(locationInput, { target: { value: 'Location 2' } });

    expect(screen.queryByText('Test Event 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Event 2')).toBeInTheDocument();
  });

  test('handles RSVP button click', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    });

    const rsvpButton = screen.getAllByText('RSVP')[0];
    fireEvent.click(rsvpButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/events/1/rsvp/123'),
        expect.any(Object)
      );
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'RSVP Successful',
        status: 'success',
      }));
    });
  });

});