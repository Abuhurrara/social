import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, User } from 'lucide-react';
import { postsAPI } from '../utils/api';
import { Post } from '../types';
import { formatRelativeTime } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import CommentForm from '../components/Posts/CommentForm';
import CommentList from '../components/Posts/CommentList';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const postData = await postsAPI.getById(parseInt(id));
      setPost(postData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleDeletePost = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      await postsAPI.delete(post.id);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!post) return;
    
    setIsAddingComment(true);
    try {
      await postsAPI.addComment(post.id, content);
      await fetchPost(); // Refresh to get the new comment
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsAddingComment(false);
    }
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
          <p className="text-gray-500 mb-4">Post not found</p>
          <Link to="/">
            <Button>Back to Feed</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const canEdit = user && (user.id === post.user_id || user.role?.name === 'admin' || user.role?.name === 'moderator');
  const canDelete = user && (user.id === post.user_id || user.role?.name === 'admin');

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Feed</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Card className="mb-8">
          <Card.Header>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.user?.name || 'Unknown User'}</h3>
                  <p className="text-sm text-gray-500">{formatRelativeTime(post.created_at)}</p>
                  {post.updated_at !== post.created_at && (
                    <p className="text-xs text-gray-400">
                      Updated {formatRelativeTime(post.updated_at)}
                    </p>
                  )}
                </div>
              </div>
              
              {canEdit && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                    className="p-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card.Header>

          <Card.Content>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900">
              Comments ({post.comments?.length || 0})
            </h2>
          </Card.Header>

          <Card.Content>
            <CommentForm onSubmit={handleAddComment} isSubmitting={isAddingComment} />
            
            {post.comments && post.comments.length > 0 && (
              <div className="mt-6">
                <CommentList comments={post.comments} />
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </Layout>
  );
};

export default PostDetail;