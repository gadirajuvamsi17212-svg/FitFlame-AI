/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page = 'home' | 'about' | 'blog' | 'tools' | 'contact';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: 'Nutrition' | 'Exercise' | 'Mental Health' | 'Preventive';
  excerpt: string;
  content: string;
  readTime: string;
  image: string;
  date: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    dosha: 'Vata' | 'Pitta' | 'Kapha';
  }[];
}
