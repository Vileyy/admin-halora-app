export interface Notification {
  id: string;
  title: string;
  content: string;
  important: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationData {
  title: string;
  content: string;
  important: boolean;
}

export interface UpdateNotificationData {
  title?: string;
  content?: string;
  important?: boolean;
  isRead?: boolean;
}
