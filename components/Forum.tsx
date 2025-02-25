"use client";

import { useState, useEffect } from "react";
import Post from "./Post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface PostType {
  id: string;
  content: string;
  replies: PostType[];
  likes: number;
  dislikes: number;
  timestamp: number;
}

export default function Forum() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPosts((currentPosts) => [...currentPosts]);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    if (newPost.trim()) {
      setIsPosting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      setPosts((prevPosts) => [
        {
          id: Date.now().toString(),
          content: newPost,
          replies: [],
          likes: 0,
          dislikes: 0,
          timestamp: Date.now(),
        },
        ...prevPosts,
      ]);

      setNewPost("");
      setIsPosting(false);
    }
  };

  const addReply = async (parentId: string, content: string, depth: number) => {
    if (depth >= 3) return; // Limit reply depth to 3

    const updateReplies = (posts: PostType[]): PostType[] => {
      return posts.map((post) => {
        if (post.id === parentId) {
          return {
            ...post,
            replies: [
              ...post.replies,
              {
                id: Date.now().toString(),
                content,
                replies: [],
                likes: 0,
                dislikes: 0,
                timestamp: Date.now(),
              },
            ],
          };
        } else if (post.replies.length > 0) {
          return { ...post, replies: updateReplies(post.replies) };
        }
        return post;
      });
    };

    setPosts(updateReplies(posts));
  };

  const handleVote = (postId: string, isLike: boolean) => {
    const updateVotes = (posts: PostType[]): PostType[] => {
      return posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLike ? post.likes + 1 : post.likes,
            dislikes: !isLike ? post.dislikes + 1 : post.dislikes,
          };
        } else if (post.replies.length > 0) {
          return { ...post, replies: updateVotes(post.replies) };
        }
        return post;
      });
    };

    setPosts(updateVotes(posts));
  };

  return (
    <div className="space-y-6">
      {/* Form for posting */}
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="flex w-full !border-none gap-2">
          <Input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="پست جدیدی بنویسید..."
            className="flex-grow text-base truncate rounded-xl"
            disabled={isPosting}
          />
          <Button
            type="submit" // Ensures Enter submits the form
            className="flex items-center gap-2 px-1 py-2.5 rounded-full"
            disabled={isPosting}
          >
            {isPosting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="whitespace-nowrap hidden sm:inline">
              ارسال پست
            </span>
          </Button>
        </div>
      </form>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            addReply={addReply}
            handleVote={handleVote}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}
