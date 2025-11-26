import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CreatePostPayload, UpdatePostPayload, PostWithMetadata } from '../../types';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';

interface PostFormProps {
  onSubmit: (data: CreatePostPayload | UpdatePostPayload) => Promise<void>;
  onCancel?: () => void;
  initialData?: PostWithMetadata;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length > 1000) {
      newErrors.content = 'Content must be 1000 characters or less';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    const postData: CreatePostPayload = {
      title: title.trim(),
      content: content.trim(),
      tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };
    
    try {
      await onSubmit(postData);
    } catch (error) {
      console.error('PostForm submission error:', error);
      // Error is handled by parent component
    }
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h2>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            error={errors.title}
            maxLength={100}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={6}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content}</p>
            )}
            <p className="text-xs text-gray-500">
              {content.length}/1000 characters
            </p>
          </div>

          <Input
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags separated by commas (optional)"
          />

          <div className="flex items-center justify-end space-x-3 pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} type="button">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default PostForm;