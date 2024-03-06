import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import PostListScreen from './PostListScreen';

const mockAxios = new MockAdapter(axios);

describe('PostListScreen component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test('renders loading message initially', async () => {
    render(<PostListScreen />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the initial API call to complete
    await waitFor(() => expect(mockAxios.history.get.length).toBe(1));
  });

  test('renders posts after fetching data successfully', async () => {
    const mockPosts = [
      { data: { title: 'Post 1', selftext: 'Content 1', author: 'Author 1' } },
      { data: { title: 'Post 2', selftext: 'Content 2', author: 'Author 2' } }
    ];

    mockAxios.onGet().reply(200, { data: { children: mockPosts, after: 'someAfterToken' } });

    render(<PostListScreen />);

    // Wait for the API call and loading state to resolve
    await waitFor(() => expect(mockAxios.history.get.length).toBe(1));
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    // Check if posts are rendered
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  test('renders error message if fetching data fails', async () => {
    mockAxios.onGet().reply(500);

    render(<PostListScreen />);

    // Wait for the API call and loading state to resolve
    await waitFor(() => expect(mockAxios.history.get.length).toBe(1));
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    // Check if error message is rendered
    expect(screen.getByText('Error fetching data. Please try again later.')).toBeInTheDocument();
  });
});
