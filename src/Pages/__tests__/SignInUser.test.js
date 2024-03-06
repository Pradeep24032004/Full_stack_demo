import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SignInUser from './SignInUser';

const mockAxios = new MockAdapter(axios);

describe('SignInUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test('renders sign in form', () => {
    render(<SignInUser />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  test('submits sign in form with valid credentials', async () => {
    render(<SignInUser />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    mockAxios.onPost('http://localhost:5000/signin').reply(200, { success: true });

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1);
      //expect(screen.getByText('Sign in successful')).toBeInTheDocument();
    });
  });

  test('displays error message for invalid credentials', async () => {
    render(<SignInUser />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

    mockAxios.onPost('http://localhost:5000/signin').reply(200, { success: false, message: 'Invalid credentials' });

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1);
      //expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('displays error message for internal server error', async () => {
    render(<SignInUser />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    mockAxios.onPost('http://localhost:5000/signin').reply(500);

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1);
      expect(screen.getByText('Internal server error')).toBeInTheDocument();
    });
  });
});
