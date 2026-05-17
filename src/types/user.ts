export type UserRole = "user" | "admin";

export type UserStatus = "active" | "suspended" | "deactivated";

export type UserGender = "male" | "female";

export type User = {
  id: string;
  name: string;
  username: string;
  password: string;
  gender: UserGender;
  role: UserRole;
  avatarUrl: string;
  shortDescription: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};
