import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import { CreatePostPayload, UpdatePostPayload } from '../types';
import Layout from '../components/Layout/Layout';
import PostForm from '../components/Posts/PostForm';

const CreatePost: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (postData: CreatePostPayload | UpdatePostPayload) => {
    setIsSubmitting(true);
    setError('');

    try {
      const newPost = await postsAPI.create(postData as CreatePostPayload);
      navigate(`/posts/${newPost.id}`);
    } catch (err: any) {
      console.error('Create post error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to create post';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-2">Share your thoughts with the community</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <PostForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  );
};

export default CreatePost;