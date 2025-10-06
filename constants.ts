import { ElementType, GlobalStyles, SocialPlatform } from './types';

export const COMPONENT_TYPES: { name: string; type: ElementType }[] = [
  { name: 'Text', type: 'text' },
  { name: 'Image', type: 'image' },
  { name: 'Button', type: 'button' },
  { name: 'Divider', type: 'divider' },
  { name: 'Spacer', type: 'spacer' },
  { name: 'Social', type: 'social' },
];

export const LAYOUT_TYPES: { name: string; columns: number; widths: string[] }[] = [
  { name: '1 Column', columns: 1, widths: ['100%'] },
  { name: '2 Columns (50/50)', columns: 2, widths: ['50%', '50%'] },
  { name: '2 Columns (33/67)', columns: 2, widths: ['33.33%', '66.67%'] },
  { name: '2 Columns (67/33)', columns: 2, widths: ['66.67%', '33.33%'] },
  { name: '3 Columns (33/33/33)', columns: 3, widths: ['33.33%', '33.33%', '33.33%'] },
  { name: '3 Columns (25/25/50)', columns: 3, widths: ['25%', '25%', '50%'] },
  { name: '3 Columns (50/25/25)', columns: 3, widths: ['50%', '25%', '25%'] },
  { name: '3 Columns (25/50/25)', columns: 3, widths: ['25%', '50%', '25%'] },
  { name: '4 Columns (25/25/25/25)', columns: 4, widths: ['25%', '25%', '25%', '25%'] },
  { name: '4 Columns (40/20/20/20)', columns: 4, widths: ['40%', '20%', '20%', '20%'] },
  { name: '4 Columns (20/20/20/40)', columns: 4, widths: ['20%', '20%', '20%', '40%'] },
];

export const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  background: '#f1f5f9', // slate-100
  contentBackground: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  textColor: '#1e293b', // slate-800
  width: 600,
};

export const SOCIAL_PLATFORM_COLORS: { [key in SocialPlatform]: string } = {
  Facebook: '#1877F2',
  Twitter: '#1DA1F2',
  Instagram: '#E4405F',
  LinkedIn: '#0A66C2',
  YouTube: '#FF0000',
  Pinterest: '#E60023',
  Website: '#4A5568',
  Email: '#805AD5',
};

export const SOCIAL_ICON_URLS: { [key in SocialPlatform]: string } = {
  Facebook: 'https://cdn0.iconfinder.com/data/icons/social-media-circle-6/1024/facebook-1024.png',
  Twitter: 'https://cdn0.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/twitter-1024.png',
  Instagram: 'https://cdn0.iconfinder.com/data/icons/social-media-circle-6/1024/instagram-1024.png',
  LinkedIn: 'https://cdn0.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/linkedin-1024.png',
  YouTube: 'https://cdn0.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/youtube-1024.png',
  Pinterest: 'https://cdn0.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/pinterest-1024.png',
  Website: 'https://cdn3.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/longShadow-1024.png',
  Email: 'https://cdn0.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/mail-1024.png',
};

export const GOOGLE_FONTS = [
  // Web Safe
  'Arial',
  'Verdana',
  'Georgia',
  'Times New Roman',
  'Courier New',
  // Sans-Serif
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Source Sans Pro',
  'Raleway',
  'Poppins',
  'Nunito Sans',
  'Inter',
  'Work Sans',
  // Serif
  'Merriweather',
  'Playfair Display',
  'Lora',
  'PT Serif',
  // Display
  'Oswald',
  'Pacifico',
  'Lobster',
  'Anton',
  'Bebas Neue',
  // Monospace
  'Inconsolata',
  'Source Code Pro',
  'Fira Code'
];