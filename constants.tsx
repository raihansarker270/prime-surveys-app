
import React from 'react';
import type { Survey, WithdrawalOption } from './types';

export const MOCK_SURVEYS: Survey[] = [
  { id: '1', title: 'Daily Shopping Habits', description: 'Share your thoughts on your recent shopping experiences.', estimatedTime: 10, reward: 75, category: 'Retail' },
  { id: '2', title: 'Tech Gadget Usage', description: 'A survey about the electronic devices you use every day.', estimatedTime: 15, reward: 120, category: 'Technology' },
  { id: '3', title: 'Favorite Streaming Services', description: 'Tell us which streaming platforms you love and why.', estimatedTime: 8, reward: 60, category: 'Entertainment' },
  { id: '4', title: 'Travel and Vacation Plans', description: 'A survey about your upcoming travel plans and preferences.', estimatedTime: 20, reward: 200, category: 'Travel' },
  { id: '5', title: 'Healthy Eating Choices', description: 'We want to know more about your dietary habits.', estimatedTime: 12, reward: 90, category: 'Health' },
  { id: '6', title: 'Mobile Gaming Survey', description: 'Share your experiences with mobile games.', estimatedTime: 18, reward: 150, category: 'Gaming' },
  { id: '7', title: 'Car Ownership Feedback', description: 'A survey for car owners about their vehicle and maintenance.', estimatedTime: 25, reward: 250, category: 'Automotive' },
  { id: '8', title: 'Work From Home Experience', description: 'How has working remotely affected you? Let us know.', estimatedTime: 10, reward: 80, category: 'Career' },
];

const PayPalIcon: React.FC = () => (
    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.344 3.375h9.312c1.781 0 2.813 1.031 2.531 2.813l-1.406 9.375c-.188 1.406-1.313 2.437-2.719 2.437h-3.375c-.375 0-.656-.281-.75-.656l-.656-3.844c-.094-.563-.563-1.031-1.125-1.031h-1.5c-1.5 0-2.438-1.031-2.156-2.531l1.406-8.594C6.187 3.937 6.656 3.375 7.344 3.375zm5.063 7.875c-.094.562-.563 1.031-1.125 1.031h-1.406c-.375 0-.656-.281-.75-.656l-.281-1.875c-.094-.563.281-1.125.844-1.125h2.156c.469 0 .844.375.938.844l-.375 1.781z" fill="#003087"/>
      <path d="M8.563 3.094h7.594c1.687 0 2.718.937 2.531 2.531l-1.031 6.844c-.188 1.406-1.125 2.531-2.531 2.531h-2.25c-.375 0-.656-.281-.75-.656l-.937-5.531c-.094-.563-.563-1.031-1.125-1.031h-1.5c-1.219 0-2.063-.844-1.875-1.969l1.031-6.187c.188-.844.75-1.563 1.594-1.563z" fill="#009cde"/>
      <path d="M11.844 6.844l-.469 2.719c-.094.469-.469.844-.938.844h-2.156c-.469 0-.844-.375-.938-.844l-.281-1.781c-.094-.563.281-1.031.844-1.031h2.969c.375 0 .656.281.75.719c-.094.188-.188.375-.281.563z" fill="#002f86"/>
    </svg>
);
  

const AmazonIcon: React.FC = () => (
    <svg className="w-16 h-16" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.58,39.52c0.23-0.08,0.46-0.15,0.7-0.23c2.4-0.81,5.2-1.25,8.71-1.25c4.78,0,8.37,1.21,10.77,3.63 c2.4,2.42,3.6,5.65,3.6,9.7c0,2.92-0.53,5.43-1.6,7.53c-1.07,2.1-2.62,3.77-4.66,5.01c-2.04,1.24-4.59,2.15-7.65,2.73 l-3.48,0.66v8.68h-9.97V39.52z M39.55,61.12c1.77-0.34,3.23-0.81,4.37-1.42c1.14-0.61,2.05-1.45,2.73-2.53 c0.68-1.08,1.02-2.42,1.02-4.02c0-2.34-0.66-4.22-1.99-5.63c-1.33-1.41-3.23-2.11-5.7-2.11c-2.3,0-4.2,0.42-5.7,1.25v12.23 C36.21,61.6,37.78,61.46,39.55,61.12z" fill="#FF9900"/>
        <path d="M68.52,73.5c-4.32,4.6-9.8,6.9-16.44,6.9c-6.88,0-12.78-2.5-17.69-7.52c-4.91-5.02-7.37-11.45-7.37-19.3 c0-7.85,2.46-14.28,7.37-19.3c4.91-5.02,10.81-7.52,17.69-7.52c6.64,0,12.12,2.3,16.44,6.9c3.75,4,5.92,9.08,6.5,15.22h-9.88 c-0.49-3.23-1.6-5.83-3.34-7.79c-1.74-1.96-4.06-2.94-6.96-2.94c-3.27,0-5.99,1.15-8.15,3.46c-2.16,2.31-3.24,5.41-3.24,9.3 c0,3.89,1.08,6.99,3.24,9.3c2.16,2.31,4.88,3.46,8.15,3.46c2.9,0,5.22-0.98,6.96-2.94c1.74-1.96,2.85-4.56,3.34-7.79h9.88 C74.44,64.42,72.27,69.5,68.52,73.5z" fill="#FF9900"/>
    </svg>
);


export const WITHDRAWAL_OPTIONS: WithdrawalOption[] = [
    { id: 'paypal', name: 'PayPal', logo: <PayPalIcon />, minAmount: 500, description: 'Direct transfer to your PayPal account.' },
    { id: 'amazon', name: 'Amazon Gift Card', logo: <AmazonIcon />, minAmount: 1000, description: 'Receive an Amazon gift card via email.' },
];
