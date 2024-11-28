const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ userId: '1' }),
}));

// Mock @chakra-ui/react
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => mockToast,
}));

// Import the component after mocking dependencies
const CaregiverAssignedTasks = require('../pages/Caregiver/CaregiverTaskAssigned').default;

describe('CaregiverAssignedTasks', () => {
  const mockTasks = [
    { id: 1, name: 'Task 1', description: 'Description 1', status: 'PENDING' },
    { id: 2, name: 'Task 2', description: 'Description 2', status: 'COMPLETED' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    require('axios').get.mockResolvedValue({ data: { success: true, data: mockTasks } });
  });

//     require('axios').put.mockResolvedValue({ data: { success: true } });

//     render(
//       <BrowserRouter>
//         <CaregiverAssignedTasks />
//       </BrowserRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Task 1')).toBeInTheDocument();
//     });

//     const completeButton = screen.getByText('Mark as Completed');
//     fireEvent.click(completeButton);

//     await waitFor(() => {
//       expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
//         title: 'Task Completed',
//         status: 'success',
//       }));
//     });
//   });

  test('displays error toast when fetching tasks fails', async () => {
    require('axios').get.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <CaregiverAssignedTasks />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error',
        description: 'Unable to fetch tasks. Please try again later.',
        status: 'error',
      }));
    });
  });
});