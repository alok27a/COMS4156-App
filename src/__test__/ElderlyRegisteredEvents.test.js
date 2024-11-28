/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ElderlyRegisteredEvents from '../pages/Elderly/ElderlyRegisteredEvents';
import { useParams } from 'react-router-dom';
import * as chakraUI from '@chakra-ui/react';

// Mock the dependencies
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('ElderlyRegisteredEvents', () => {
  const mockUserId = '123';
  const mockToast = jest.fn();
  const mockEvents = [
    {
      event: {
        id: '1',
        name: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        date: '2023-01-01',
        time: '12:00',
      },
      status: 'CONFIRMED',
    },
  ];

  beforeEach(() => {
    useParams.mockReturnValue({ userId: mockUserId });
    chakraUI.useToast.mockReturnValue(mockToast);
    global.fetch.mockClear();
  });

  test('renders loading state initially', () => {
    render(<ElderlyRegisteredEvents />);
    expect(screen.getByText('Registered Events')).toBeInTheDocument();
    expect(screen.getByText('Here are the events you have registered for:')).toBeInTheDocument();
  });

  test('renders registered events when API call is successful', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockEvents }),
    });

    render(<ElderlyRegisteredEvents />);

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Location: Test Location')).toBeInTheDocument();
      expect(screen.getByText('Date: 2023-01-01')).toBeInTheDocument();
      expect(screen.getByText('Time: 12:00')).toBeInTheDocument();
      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
    });
  });

  test('shows error toast when API call fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<ElderlyRegisteredEvents />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error Fetching Events',
        status: 'error',
      }));
    });
  });

  test('handles RSVP cancellation', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEvents }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true }),
      });

    render(<ElderlyRegisteredEvents />);

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel RSVP'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'RSVP Cancelled',
        status: 'success',
      }));
    });
  });

  test('renders no events message when there are no registered events', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: [] }),
    });

    render(<ElderlyRegisteredEvents />);

    await waitFor(() => {
      expect(screen.getByText('No registered events to display.')).toBeInTheDocument();
    });
  });
});