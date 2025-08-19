// Traffic-Lens Type Definitions

export interface TLDomain {
  id: number;
  userId: number;
  domain: string;
  siteName: string;
  serviceWorkerPath: string;
  vapidPublicKey?: string;
  vapidPrivateKey?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TLSubscriber {
  id: number;
  domainId: number;
  endpoint: string;
  p256dhKey: string;
  authKey: string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  subscribedAt: Date;
  lastSeen: Date;
  isActive: boolean;
}

export interface TLCampaign {
  id: number;
  domainId: number;
  userId: number;
  title: string;
  body: string;
  iconUrl?: string | null;
  imageUrl?: string | null;
  clickUrl?: string | null;
  badgeUrl?: string | null;
  scheduledAt?: Date | null;
  sentAt?: Date | null;
  status: string;
  targetType: string;
  targetFilter?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface TLNotification {
  id: number;
  campaignId: number;
  subscriberId: number;
  sentAt: Date;
  clickedAt?: Date;
  status: 'sent' | 'clicked' | 'failed';
  errorMessage?: string;
  userAgent?: string;
}

export interface TLTrafficTrigger {
  id: number;
  domainId: number;
  triggerName: string;
  triggerType: 'page_view' | 'time_spent' | 'bounce_rate' | 'conversion';
  conditions: any;
  campaignTemplate?: any;
  isActive: boolean;
  createdAt: Date;
}

export interface TLStatsDaily {
  id: number;
  domainId: number;
  date: Date;
  totalSubscribers: number;
  newSubscribers: number;
  unsubscribed: number;
  campaignsSent: number;
  totalNotifications: number;
  totalClicks: number;
  clickRate: number;
}

export interface CreateDomainRequest {
  domain: string;
  siteName: string;
  serviceWorkerPath?: string;
}

export interface CreateCampaignRequest {
  domainId: number;
  title: string;
  body: string;
  iconUrl?: string | null;
  imageUrl?: string | null;
  clickUrl?: string | null;
  badgeUrl?: string | null;
  scheduledAt?: Date | null;
  targetType?: 'all' | 'segment' | 'individual';
  targetFilter?: any;
}

export interface SubscribeRequest {
  domainId: number;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
}

export interface SendNotificationRequest {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  url?: string;
}

export interface VAPIDKeys {
  publicKey: string;
  privateKey: string;
}

export interface ServiceWorkerConfig {
  domain: string;
  vapidPublicKey: string;
  serverUrl: string;
}

// Dashboard Data Types
export interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  totalCampaigns: number;
  sentNotifications: number;
  clickRate: number;
  recentCampaigns: TLCampaign[];
  subscriberGrowth: Array<{
    date: string;
    subscribers: number;
  }>;
  topPerformingCampaigns: Array<{
    campaignId: number;
    title: string;
    sent: number;
    clicked: number;
    clickRate: number;
  }>;
  todayNotifications?: number;
  averageClickRate?: number;
  campaignPerformance?: Array<{
    campaignId: number;
    title: string;
    sent: number;
    clicked: number;
    clickRate: number;
  }>;
  error?: string;
}

// Subscriber Segment Types
export interface SubscriberSegment {
  name: string;
  conditions: {
    countries?: string[];
    cities?: string[];
    subscribedAfter?: Date;
    subscribedBefore?: Date;
    lastSeenAfter?: Date;
    lastSeenBefore?: Date;
    isActive?: boolean;
  };
}

// Traffic Trigger Condition Types
export interface PageViewCondition {
  pages: string[];
  timeSpent?: {
    min?: number;
    max?: number;
  };
  exitWithoutConversion?: boolean;
}

export interface TrafficAnalysisCondition {
  peakHours?: number[];
  dayOfWeek?: number[];
  trafficIncrease?: number;
}

export interface CampaignTemplate {
  title: string;
  body: string;
  iconUrl?: string | null;
  imageUrl?: string | null;
  clickUrl?: string | null;
  delay?: number; // seconds
}

// Error Types
export interface TLError {
  code: string;
  message: string;
  details?: any;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: TLError;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
