export interface Attribute {
  id: string;
  user_id: string;
  name: string;
  value: string;
  type: AttributeType;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export type AttributeType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'url' 
  | 'image' 
  | 'date' 
  | 'address' 
  | 'social_media';

export interface CreateAttributeDto {
  name: string;
  value: string;
  type: AttributeType;
}

export interface UpdateAttributeDto {
  name?: string;
  value?: string;
  type?: AttributeType;
  is_verified?: boolean;
}

export const ATTRIBUTE_TYPES: Record<AttributeType, string> = {
  text: 'Text',
  email: 'Email',
  phone: 'Phone Number',
  url: 'Website URL',
  image: 'Profile Image',
  date: 'Date',
  address: 'Address',
  social_media: 'Social Media'
};
