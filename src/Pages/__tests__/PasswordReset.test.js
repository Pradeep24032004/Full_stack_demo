import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import PasswordReset from '../PasswordReset.jsx';

jest.mock('axios'); // Mock axios for testing purposes

test('Submit form with valid data', async () => {
  render(<PasswordReset />);

  // Fill out the form fields
  fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Enter new password'), { target: { value: 'newPassword' } });
  fireEvent.change(screen.getByPlaceholderText('Confirm new password'), { target: { value: 'newPassword' } });

  // Mock the response from the server
  axios.post.mockResolvedValueOnce({ data: { success: true, message: 'Password reset successful' } });

  // Submit the form
  fireEvent.submit(screen.getByRole('button', { name: /Reset Password/i }));

  // Wait for the success message
  await waitFor(() => {
    expect(screen.getByText('Password reset successful')).toBeInTheDocument();
  }, { timeout: 5000 });
});

test('Submit form with invalid data', async () => {
  render(<PasswordReset />);

  // Mock the response from the server
  axios.post.mockRejectedValueOnce(new Error('Password reset failed'));

  // Submit the form
  fireEvent.submit(screen.getByRole('button', { name: /Reset Password/i }));

  // Wait for the error message
  // Wait for the success message
  await waitFor(() => {
    expect(screen.getByText('Password rest successful')).toBeInTheDocument();
  }, { timeout: 5000 });
});
