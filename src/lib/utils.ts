import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS'
  }).format(price);
}

export function formatDateOnly(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export const formatDateServer = (date: Date | undefined): string => {
  if (!date) return '';
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
};

export function formatTimeOnly(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
export function formatDate(dateString: string): string {
  return `${formatDateOnly(dateString)} - ${formatTimeOnly(dateString)}`;
}
