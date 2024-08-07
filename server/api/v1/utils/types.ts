export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  theme_color: string;
  accent_color: string;
  created_at: Date;
}

export interface Friend {
  user_id: string;
  friend_id: string;
}

export interface Notification {
  id: string;
  sender_id: string;
  receiver_id: string;
  type: string;
  content: string;
  created_at: Date;
}
