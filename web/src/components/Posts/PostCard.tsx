import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Edit2, Trash2, User } from 'lucide-react';
import { PostWithMetadata } from '../../types';
import { formatRelativeTime } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface PostCardProps {
  post: PostWithMetadata;
  onEdit?: (post: PostWithMetadata) => void;
  onDelete?: (postId: number) => void;
  showActions?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onEdit, 
  onDelete, 
  showActions = true 
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = user && (user.id === post.user_id || user.role?.name === 'admin' || user.role?.name === 'moderator');
  const canDelete = user && (user.id === post.user_id || user.role?.name === 'admin');

  const handleDelete = async () => {
    if (!onDelete || !window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      await onDelete(post.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow animate-fade-in">
      <Card.Header>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.user?.name || 'Unknown User'}</h3>
              <p className="text-sm text-gray-500">{formatRelativeTime(post?.created_at ?? '')}</p>
            </div>
          </div>
          
          {showActions && canEdit && (
            <div className="flex items-center space-x-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(post)}
                  className="p-2"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              {canDelete && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
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
        <Link to={`/posts/${post.id}`} className="block group">
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
            {post.title}
          </h2>
          <p className="text-gray-700 line-clamp-3 mb-4">{post.content}</p>
        </Link>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Card.Content>

      <Card.Footer>
        <div className="flex items-center justify-between">
          <Link
            to={`/posts/${post.id}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">
              {post.comments_count || 0} {(post.comments_count || 0) === 1 ? 'comment' : 'comments'}
            </span>
          </Link>

          {post?.updated_at !== post?.created_at && (
            <span className="text-xs text-gray-400">
              {/*Updated {formatRelativeTime(post?.updated_at ?? "")}*/}
            </span>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default PostCard;