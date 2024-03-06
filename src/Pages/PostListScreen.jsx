// PostListScreen.jsx


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function PostListScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [after, setAfter] = useState('');
  const [error, setError] = useState(false);
  const observer = useRef();

  const fetchData = async () => { //https://www.reddit.com/r/all.json?limit=10&after=${after}
    try {
      setLoading(true);
      const response = await axios.get(`https://www.reddit.com/r/all.json?limit=10&after=${after}`);
      setPosts(prevPosts => [...prevPosts, ...response.data.data.children]);
      setLoading(false);
      setAfter(response.data.data.after);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [after]);

  const lastPostRef = useRef();

  const handleObserver = entries => {
    const target = entries[0];
    if (target.isIntersecting && !loading && !error) {
      fetchData();
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    observer.current = new IntersectionObserver(handleObserver, options);
    if (lastPostRef.current) {
      observer.current.observe(lastPostRef.current);
    }

    return () => {
      if (lastPostRef.current) {
        observer.current.unobserve(lastPostRef.current);
      }
    };
  }, [loading, error]);

  return (
    <div className="App">
      <header className="bg-gray-800 p-4">
        <motion.h1 
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Reddit - Post List
        </motion.h1>
      </header>
      <motion.main 
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <ul>
          {posts.map((post, index) => (
            <li 
              key={index} 
              className="border-b border-gray-300 py-4"
              style={{ originY: 0, scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className="text-xl font-bold mb-2">{post.data.title}</h2>
              <p className="text-gray-700">{post.data.selftext}</p>
              <p className="text-gray-500 text-sm">Posted by: {post.data.author}</p>
              {index === posts.length - 1 && <div ref={lastPostRef}></div>}
            </li>
          ))}
        </ul>
        {loading && <p className="text-center my-4">Loading...</p>}
        {error && <p className="text-center my-4 text-red-500">Error fetching data. Please try again later.</p>}
      </motion.main>
    </div>
  );
}

export default PostListScreen;
