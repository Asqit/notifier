import {
  createUser,
  addFriend,
  createNotification,
  getNotificationsForUser,
  getFriends,
} from "./api/v1/utils/kv.ts";
import { User, Notification } from "./api/v1/utils/types.ts";

// Example of usage
// deno run -A --unstable .\kv_example.ts

const user: User = {
  id: crypto.randomUUID(),
  name: "John Doe",
  email: "john.doe@example.com",
  password: "hashed_password",
  theme_color: "#ffffff",
  accent_color: "#000000",
  created_at: new Date(),
};

await createUser(user);

const friend: User = {
  id: crypto.randomUUID(),
  name: "Jane Smith",
  email: "jane.smith@example.com",
  password: "hashed_password",
  theme_color: "#ffffff",
  accent_color: "#000000",
  created_at: new Date(),
};

await createUser(friend);
await addFriend(user.id, friend.id);

const notification: Notification = {
  id: crypto.randomUUID(),
  sender_id: user.id,
  receiver_id: friend.id,
  type: "text",
  content: "Myslím na tebe!",
  created_at: new Date(),
};

await createNotification(notification);
const notifications = await getNotificationsForUser(friend.id);
console.log(notifications);

const friends = await getFriends(user.id);
console.log(friends);
