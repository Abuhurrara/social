import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import { Post, UpdatePostPayload } from '../types';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import PostForm from '../components/Posts/PostForm';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const postData = await postsAPI.getById(parseInt(id));
        
        // Check permissions
        const canEdit = user && (user.id === postData.user_id || user.role.name === 'admin' || user.role.name === 'moderator');
        if (!canEdit) {
          navigate('/');
          return;
        }
        
        setPost(postData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (postData: UpdatePostPayload) => {
    if (!post) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const updatedPost = await postsAPI.update(post.id, postData);
      navigate(`/posts/${updatedPost.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/posts/${post?.id || ''}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-500">Post not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-gray-600 mt-2">Make changes to your post</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <PostForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={post}
          isEditing={true}
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  );
};

export default EditPost;