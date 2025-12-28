/**
 * Form for adding comments to a workflow step
 */

import { useState } from 'react';
import type { Comment } from '../../api/workflow';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
}

interface CommentListProps {
  comments: Comment[];
  currentWorkflowGroup: string | null;
}

export function CommentForm({ onSubmit, isLoading = false }: Readonly<CommentFormProps>) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    await onSubmit(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        disabled={isLoading}
      />
      <button type="submit" disabled={!content.trim() || isLoading}>
        {isLoading ? 'Adding...' : 'Add Comment'}
      </button>

      <style>{`
        .comment-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .comment-form textarea {
          padding: 12px;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
          background: var(--color-card);
          color: var(--color-text);
        }

        .comment-form textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-light);
        }

        .comment-form textarea:disabled {
          background: var(--color-card-secondary);
        }

        .comment-form button {
          align-self: flex-end;
          padding: 10px 20px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .comment-form button:hover:not(:disabled) {
          background: var(--color-primary-dark);
        }

        .comment-form button:disabled {
          background: var(--color-secondary);
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

export function CommentList({ comments, currentWorkflowGroup }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="no-comments">
        <p>No comments yet. Be the first to add one!</p>
        <style>{`
          .no-comments {
            text-align: center;
            color: var(--color-text-secondary);
            padding: 20px;
            background: var(--color-card-secondary);
            border-radius: 6px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={`comment-item ${comment.workflow_group === currentWorkflowGroup ? 'current-step' : ''}`}
        >
          <div className="comment-header">
            <span className="comment-author">{comment.user_name}</span>
            <span className="comment-step">@ {comment.workflow_group}</span>
            <span className="comment-time">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
          <div className="comment-content">{comment.content}</div>
        </div>
      ))}

      <style>{`
        .comment-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .comment-item {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 12px;
        }

        .comment-item.current-step {
          border-left: 3px solid var(--color-primary);
        }

        .comment-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .comment-author {
          font-weight: bold;
          color: var(--color-text);
        }

        .comment-step {
          background: var(--color-background-hover);
          padding: 2px 8px;
          border-radius: 4px;
          color: var(--color-text-secondary);
        }

        .comment-time {
          color: var(--color-text-muted);
          margin-left: auto;
        }

        .comment-content {
          color: var(--color-text);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
