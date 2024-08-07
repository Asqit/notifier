import { Friend, Notification, User } from "./types.ts";

const kv = await Deno.openKv("kv.db");

export async function createUser(user: User) {
  await kv.set(["users", user.id], user);
}

export async function getUser(userId: string): Promise<User | null> {
  const user = await kv.get<User>(["users", userId]);
  return user.value;
}

export async function addFriend(userId: string, friendId: string) {
  const friend: Friend = { user_id: userId, friend_id: friendId };
  await kv.set(["friends", userId, friendId], friend);
}

export async function getFriends(userId: string): Promise<Friend[]> {
  const friends: Friend[] = [];
  for await (const { value } of kv.list<Friend>({
    prefix: ["friends", userId],
  })) {
    friends.push(value);
  }
  return friends;
}

export async function createNotification(notification: Notification) {
  await kv.set(["notifications", notification.id], notification);
}

export async function getNotificationsForUser(
  userId: string
): Promise<Notification[]> {
  const notifications: Notification[] = [];
  for await (const { value } of kv.list<Notification>({
    prefix: ["notifications"],
  })) {
    if (value.receiver_id === userId) {
      notifications.push(value);
    }
  }
  return notifications;
}
