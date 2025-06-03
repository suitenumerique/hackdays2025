import {APP_BASE} from "../config";

export interface PhotoLibraryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PhotoItem[];
}

export interface PhotoItem {
  id: string;
  abilities: {
    accesses_manage: boolean;
    accesses_view: boolean;
    children_list: boolean;
    children_create: boolean;
    destroy: boolean;
    hard_delete: boolean;
    favorite: boolean;
    link_configuration: boolean;
    invite_owner: boolean;
    move: boolean;
    restore: boolean;
    retrieve: boolean;
    tree: boolean;
    media_auth: boolean;
    partial_update: boolean;
    update: boolean;
    upload_ended: boolean;
  };
  created_at: string;
  creator: {
    full_name: string;
    short_name: string;
  };
  depth: number;
  is_favorite: boolean;
  link_role: string;
  link_reach: string;
  nb_accesses: number;
  numchild: number;
  numchild_folder: number;
  path: string;
  title: string;
  updated_at: string;
  user_roles: string[];
  type: string;
  upload_state: string;
  url: string;
  filename: string;
  mimetype: string;
  main_workspace: boolean;
  size: number;
  description: string | null;
  deleted_at: string | null;
  hard_delete_at: string | null;
}

export const fetchPhotos = async () => {
  const response = await fetch(`${APP_BASE}:8071/api/v1.0/items/b3e8038b-6310-4a10-8815-99aadabb6e17/children/?page_size=10&ordering=-type%2C-created_at`, {
    headers: {
      'Authorization': `Token ${localStorage.getItem('DRIVE_TOKEN')}`
    }
  });
  const data: PhotoLibraryResponse = await response.json();
  return data;
};