// frontend/src/components/CommentsSection.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaComment, FaPaperPlane, FaUser } from 'react-icons/fa';
import { createComment, toggleLike } from '../redux/slices/postSlice';

const CommentsSection = ({ postId }) => {
  const dispatch = useDispatch();
  const { comments, currentPost } = useSelector((state) => state.post);
  const { userInfo } = useSelector((state) => state.user);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userInfo) return;

    setIsSubmitting(true);
    try {
      await dispatch(createComment({ postId, content: newComment })).unwrap();
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async () => {
    if (!userInfo) return;
    try {
      await dispatch(toggleLike(postId)).unwrap();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const isLiked = currentPost?.likes?.includes(userInfo?._id);

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
      {/* Likes Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleLike}
            disabled={!userInfo}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${!userInfo ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaHeart className={isLiked ? 'text-red-500' : ''} />
            <span>{currentPost?.likes?.length || 0} Likes</span>
          </button>
        </div>
        <div className="text-gray-600">
          <FaComment className="inline mr-1" />
          {comments.length} Comments
        </div>
      </div>

      {/* Comment Form */}
      {userInfo ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex space-x-3">
            <img
              src={userInfo.profilePicture || '/default-avatar.png'}
              alt={userInfo.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="mt-2 flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
                <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-gray-600 mb-6">Please log in to comment and like posts.</p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex space-x-3 p-4 bg-white rounded-lg border">
              <img
                src={comment.user?.profilePicture || '/default-avatar.png'}
                alt={comment.user?.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-800">{comment.user?.username}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
