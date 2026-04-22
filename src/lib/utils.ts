import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Round and format a number in Hebrew locale (no decimals). */
export const fmt = (n: number): string => Math.round(n).toLocaleString('he-IL')

export function formatCurrency(value: number): string {
  return value.toLocaleString('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  })
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toLocaleString('he-IL', { maximumFractionDigits: decimals })
}

export function parseCurrencyInput(raw: string): number {
  const cleaned = raw.replace(/[^\d.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function isNegativeValue(value: number): boolean {
  return value < 0
}

/** Returns true if a JWT is expired (or unparseable). */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number }
    return payload.exp !== undefined && Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}
