import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle } from 'lucide-react';
import { usersAPI, postsAPI } from '../utils/api';
import { PostWithMetadata, FeedParams } from '../types';
import Layout from '../components/Layout/Layout';
import PostCard from '../components/Posts/PostCard';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setIsDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState('');
  const [sort, setSort] = useState('desc');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const fetchFeed = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: FeedParams = {
        sort,
      };
      
      if (search.trim()) params.search = search.trim();
      if (tags.trim()) params.tags = tags.trim();
      
      const feedData = await usersAPI.getFeed(params);
      setPosts(feedData || []); // Handle null response
    } catch (err: any) {
      console.error('Feed error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to load feed';
      setError(errorMessage);
      setPosts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Feed useEffect triggered, sort:', sort);
    fetchFeed().catch(console.error);
  }, [sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFeed().catch(console.error);
  };

  const handleDeletePost = async (postId: number) => {
    setIsDeleting(postId);
    try {
      await postsAPI.delete(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditPost = (post: PostWithMetadata) => {
    navigate(`/posts/${post.id}/edit`);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
            <Button onClick={() => navigate('/create')} className="flex items-center space-x-2">
              <PlusCircle className="w-4 h-4" />
              <span>New Post</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" variant="outline" className="px-4">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Filter by tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <PlusCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Social!</h3>
              <p className="text-gray-500 mb-4">
                {search || tags ? 'No posts match your search criteria.' : 'Your feed is empty. Start by creating your first post or following other users.'}
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => navigate('/create')} className="flex items-center space-x-2">
                <PlusCircle className="w-4 h-4" />
                <span>Create your first post</span>
              </Button>
              {(search || tags) && (
                <div>
                  <Button variant="outline" onClick={() => { 
                    setSearch(''); 
                    setTags(''); 
                    setTimeout(() => fetchFeed(), 0); 
                  }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Feed;