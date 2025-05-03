export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  created_at: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
}
