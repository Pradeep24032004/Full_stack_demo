import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../SignUp.jsx';

jest.mock('axios'); // Mock axios for testing purposes

test('Submit form with valid data', async () => {
  render(<SignUp />);

  // Fill out the form fields
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
  fireEvent.change(screen.getByPlaceholderText('Name (Optional)'), { target: { value: 'Test User' } });

  // Submit the form
  fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));

  // Wait for the success message
  await waitFor(() => {
    expect(screen.getByText('Sign up successful')).toBeInTheDocument();
  }, { timeout: 5000 });
});
