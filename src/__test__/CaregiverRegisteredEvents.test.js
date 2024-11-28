/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-wait-for-side-effects */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CaregiverRegisteredEvents from '../pages/Caregiver/CaregiverRegisteredEvents';
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

// Mock fetch
global.fetch = jest.fn();

describe('CaregiverRegisteredEvents', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ userId: '123' });
    useToast.mockReturnValue(jest.fn());
    fetch.mockClear();
  });

  test('renders component and fetches events', async () => {
    const mockEvents = [
      { id: 1, name: 'Event 1', description: 'Description 1', host: { id: '123' } },
      { id: 2, name: 'Event 2', description: 'Description 2', host: { id: '456' } },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockEvents }),
    });

    render(<CaregiverRegisteredEvents />);

    await waitFor(() => {
      expect(screen.getByText('Your Registered Events')).toBeInTheDocument();
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
  });

  test('handles search functionality', async () => {
    const mockEvents = [
      { id: 1, name: 'Event 1', description: 'Description 1', host: { id: '123' } },
      { id: 2, name: 'Event 2', description: 'Description 2', host: { id: '456' } },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockEvents }),
    });

    render(<CaregiverRegisteredEvents />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search events...');
      fireEvent.change(searchInput, { target: { value: 'Event 1' } });
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
    });
  });


  test('deletes event when Delete button is clicked', async () => {
    const mockEvents = [
      { id: 1, name: 'Event 1', description: 'Description 1', host: { id: '123' } },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockEvents }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
    });

    render(<CaregiverRegisteredEvents />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/events/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

});