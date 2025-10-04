
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
  backgroundColor: '#f1f5f9', // slate-100
  contentBackgroundColor: '#ffffff',
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

export const GOOGLE_FONTS = [
  'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', // Web-safe
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro', 'Raleway'
];
