import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import constants from './constants';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('jwt')) {
      navigate('/login');
      return;
    }
    axios
      .get(constants.baseUrl + '/api/post', constants.tokenHeader)
      .then(({ data }) => {
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlePostChange = (event) => {
    setNewPost({ ...newPost, [event.target.name]: event.target.value });
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        constants.baseUrl + '/api/post',
        newPost,
        constants.tokenHeader
      );

      console.log(response.data); // Handle successful post creation
      // Fetch updated post list after creating a new post
      const updatedPosts = await axios.get(
        constants.baseUrl + '/api/post',
        constants.tokenHeader
      );
      setPosts(updatedPosts.data);

      // Clear the form fields after successful post creation
      setNewPost({ title: '', content: '' });
    } catch (error) {
      console.error(error); // Handle post creation errors
      alert('Failed to create a new post');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return (
    <div className="post-list" style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Posts</h1>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px',
        }}
      >
        Logout
      </button>
      <form
        onSubmit={handlePostSubmit}
        style={{
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <label htmlFor="title" style={{ marginBottom: '8px' }}>
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={newPost.title}
          onChange={handlePostChange}
          required
          style={{ marginBottom: '15px', padding: '8px' }}
        />
        <label htmlFor="content" style={{ marginBottom: '8px' }}>
          Content:
        </label>
        <textarea
          id="content"
          name="content"
          value={newPost.content}
          onChange={handlePostChange}
          required
          style={{ marginBottom: '15px', padding: '8px', resize: 'vertical' }}
        ></textarea>
        <button
          type="submit"
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Create Post
        </button>
      </form>
      <ul
        style={{
          listStyle: 'none',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {posts.map((post) => (
          <li
            key={post.title}
            className="post-item"
            style={{
              width: '48%',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginBottom: '15px',
              padding: '10px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f0f0f0', // You can change the background color
            }}
          >
            <h2
              className="post-title"
              style={{
                fontSize: '1.5em',
                marginBottom: '10px',
                color: '#333',
              }}
            >
              {post.title}
            </h2>
            <p
              className="post-content"
              style={{
                fontSize: '1.2em',
                color: '#555',
                lineHeight: '1.4',
              }}
            >
              {post.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
