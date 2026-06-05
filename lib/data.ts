import fs from 'fs';
import path from 'path';

const appDir = process.env.APP_DIR || process.cwd();
const dataFile = path.join(appDir, 'data', 'content.json');

export interface Service {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
}

export interface ShopInfo {
  name: string;
  slogan: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  heroImage: string;
}

export interface SiteContent {
  shop: ShopInfo;
  services: Service[];
  posts: Post[];
  gallery: GalleryItem[];
}

export function readData(): SiteContent {
  const raw = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(raw);
}

export function writeData(data: SiteContent): void {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
}
