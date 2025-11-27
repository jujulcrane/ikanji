export interface User {
  id?: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  createdAt: string;
  lastLogin?: string;
  lessonIds?: string[];
}
