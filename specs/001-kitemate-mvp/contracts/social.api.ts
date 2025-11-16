/**
 * Social Service API Contract
 * 
 * Handles public profiles, discovery, follows, and notifications.
 */

import type { Widget } from './widgets.api';

// ============================================================================
// Types
// ============================================================================

export interface PublicProfile {
  userId: string;
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  followerCount: number;
  totalForksReceived: number;
  joinedAt: string;  // ISO 8601
  publicWidgets: Widget[];
}

export interface Notification {
  id: number;
  type: 'fork' | 'follow' | 'system' | 'refresh';
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

// ============================================================================
// Profile Endpoints
// ============================================================================

/**
 * GET /profile/:username
 * 
 * Get public profile by username (accessible without auth).
 */
export interface GetPublicProfileRequest {
  username: string;  // Path param
}

export interface GetPublicProfileResponse {
  profile: PublicProfile;
}

/**
 * PUT /profile
 * 
 * Update own profile (username, bio, avatar).
 */
export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateProfileResponse {
  profile: PublicProfile;
}

/**
 * POST /profile/upload-avatar
 * 
 * Upload profile avatar image.
 */
export interface UploadAvatarRequest {
  file: File | string;  // Image file (multipart) or base64
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

// ============================================================================
// Discovery Endpoints
// ============================================================================

/**
 * GET /discover/trending
 * 
 * Get trending public widgets sorted by fork count.
 */
export interface GetTrendingWidgetsRequest {
  timeRange?: '7d' | '30d' | 'all';
  limit?: number;
  offset?: number;
}

export interface GetTrendingWidgetsResponse {
  widgets: Array<Widget & {
    creatorUsername: string;
    creatorName: string;
  }>;
  total: number;
}

/**
 * GET /discover/featured
 * 
 * Get featured/curated widgets.
 */
export interface GetFeaturedWidgetsRequest {
  limit?: number;
}

export interface GetFeaturedWidgetsResponse {
  widgets: Array<Widget & {
    creatorUsername: string;
    creatorName: string;
    featured: boolean;
  }>;
}

/**
 * GET /discover/search
 * 
 * Search public widgets and profiles.
 */
export interface SearchDiscoveryRequest {
  query: string;
  type?: 'widgets' | 'profiles' | 'all';
  limit?: number;
  offset?: number;
}

export interface SearchDiscoveryResponse {
  widgets?: Widget[];
  profiles?: PublicProfile[];
  total: number;
}

// ============================================================================
// Follow Endpoints
// ============================================================================

/**
 * POST /follow/:userId
 * 
 * Follow a user.
 */
export interface FollowUserRequest {
  userId: string;  // Path param (user to follow)
}

export interface FollowUserResponse {
  success: boolean;
  followerCount: number;
}

/**
 * POST /unfollow/:userId
 * 
 * Unfollow a user.
 */
export interface UnfollowUserRequest {
  userId: string;  // Path param
}

export interface UnfollowUserResponse {
  success: boolean;
  followerCount: number;
}

/**
 * GET /followers
 * 
 * Get list of followers.
 */
export interface GetFollowersRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetFollowersResponse {
  followers: Array<{
    userId: string;
    username: string;
    name: string;
    avatarUrl?: string;
    followedAt: string;
  }>;
  total: number;
}

/**
 * GET /following
 * 
 * Get list of users being followed.
 */
export interface GetFollowingRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetFollowingResponse {
  following: Array<{
    userId: string;
    username: string;
    name: string;
    avatarUrl?: string;
    followedAt: string;
  }>;
  total: number;
}

// ============================================================================
// Notification Endpoints
// ============================================================================

/**
 * GET /notifications
 * 
 * Get user's notifications.
 */
export interface GetNotificationsRequest {
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

/**
 * PUT /notifications/:id/read
 * 
 * Mark notification as read.
 */
export interface MarkNotificationReadRequest {
  id: number;  // Path param
}

export interface MarkNotificationReadResponse {
  success: boolean;
}

/**
 * POST /notifications/mark-all-read
 * 
 * Mark all notifications as read.
 */
export interface MarkAllNotificationsReadRequest {
  // No body, auth via JWT header
}

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  markedCount: number;
}

// ============================================================================
// Error Responses
// ============================================================================

export interface SocialErrorResponse {
  code: 'profile_not_found' | 'username_taken' | 'cannot_follow_self' | 'already_following';
  message: string;
  details?: Record<string, any>;
}

