export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum AppRoute {
  HOME = 'home',
  DAY_1 = 'day1',
  DAY_2 = 'day2',
  DAY_3 = 'day3',
  DAY_4 = 'day4',
}

export interface DayConfig {
  id: AppRoute;
  title: string;
  subtitle: string;
  icon: string;
}

export interface GeneratedMedia {
  type: 'image' | 'video';
  url: string;
}