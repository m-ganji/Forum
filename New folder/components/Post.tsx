"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";

interface PostType {
  id: string;
  content: string;
  replies: PostType[];
  likes: number;
  dislikes: number;
  timestamp: number;
}

interface PostProps {
  post: PostType;
  addReply: (parentId: string, content: string, depth: number) => void;
  handleVote: (postId: string, isLike: boolean) => void;
  depth: number;
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "چند ثانیه پیش";
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  if (days < 30) return `${days} روز پیش`;

  const date = new Date(timestamp);
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Post({ post, addReply, handleVote, depth }: PostProps) {
  const [replyContent, setReplyContent] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [hasVoted, setHasVoted] = useState({ like: false, dislike: false });

  const handleAddReply = async () => {
    if (replyContent.trim()) {
      setIsReplying(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      addReply(post.id, replyContent, depth + 1);
      setReplyContent("");
      setShowReplyInput(false);
      setIsReplying(false);
    }
  };

  const handleVoteClick = (isLike: boolean) => {
    if ((isLike && hasVoted.like) || (!isLike && hasVoted.dislike)) {
      setHasVoted({ like: false, dislike: false });
      handleVote(post.id, false); // Remove the vote
    } else {
      handleVote(post.id, isLike);
      setHasVoted({ like: isLike, dislike: !isLike });
    }
  };

  const marginClass = depth === 0 ? "" : "mr-4";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id={post.id}
      className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md transition-shadow duration-300 ${marginClass} mb-4`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <p className="text-gray-800 dark:text-gray-100 max-w-[85%] truncate">
            {post.content}
          </p>
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
            {formatTimestamp(post.timestamp)}
          </span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVoteClick(true)}
              className={`flex items-center gap-1 px-2 transition-transform duration-200 ${
                hasVoted.like
                  ? "text-green-500 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm">{hasVoted.like ? 1 : 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVoteClick(false)}
              className={`flex items-center gap-1 px-2 transition-transform duration-200 ${
                hasVoted.dislike
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="text-sm">{hasVoted.dislike ? 1 : 0}</span>
            </Button>
            {depth < 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReplyInput(!showReplyInput)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 
                  text-blue-600 dark:text-blue-400 
                  border border-blue-600/20 dark:border-blue-400/20 
                  hover:bg-blue-50 dark:hover:bg-blue-900/50
                  transition-colors duration-200
                  rounded-full
                `}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">پاسخ</span>
              </Button>
            )}
          </div>
        </div>

        {showReplyInput && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddReply();
            }}
            className="flex gap-2 mt-4 items-center"
          >
            <Input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="پاسخی بنویسید..."
              className="flex-grow text-base rounded-xl"
              disabled={isReplying}
            />
            <Button
              type="submit"
              size="sm"
              className={`
                flex items-center gap-2 px-5 py-2.5
                bg-blue-600 hover:bg-blue-700 
                dark:bg-blue-500 dark:hover:bg-blue-600 
                text-white font-medium text-base
                transition-colors duration-200
                rounded-full
              `}
              disabled={isReplying}
            >
              {isReplying ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="whitespace-nowrap hidden sm:inline">
                ارسال پاسخ
              </span>
            </Button>
          </form>
        )}
      </div>

      <div className="mt-4">
        {post.replies.map((reply) => (
          <Post
            key={reply.id}
            post={reply}
            addReply={addReply}
            handleVote={handleVote}
            depth={depth + 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
