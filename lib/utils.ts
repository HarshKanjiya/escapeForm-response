import { REGEX } from "@/constants/common";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Format date to locale string */
export function formatDate(date: Date | null, locale: string = 'en-US'): string {
    if (!date) return '';
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(date));
}

export const showToast = (message: string, description?: string, type: 'success' | 'error' | "info" | "warning" = 'success') => {
    toast[type](message, {
        description,
        duration: 3000,
        action: true,
        cancel: false,
        position: 'top-center',
        richColors: true,
    });
}

export const showError = (message: string, description: string = "") => {
    showToast(message, description, 'error');
}

export const showSuccess = (message: string, description: string = "") => {
    showToast(message, description, 'success');
}

export const showInfo = (message: string, description: string = "") => {
    showToast(message, description, 'info');
}

export const showWarning = (message: string, description: string = "") => {
    showToast(message, description, 'warning');
}

/** Convert object to query string */
export const objToQueryString = (obj: Record<string, string | number>): string => {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            params.append(key, typeof obj[key] === 'string' ? obj[key] : obj[key].toString());
        }
    }
    return params.toString();
}

/** Validate UUID format */
export const isValidUUID = (uuid: string): boolean => {
    if (!uuid) return false;
    return REGEX.uuid.test(uuid);
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


/** Generate slug without special characters from text */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}


/** Sanitize user input to prevent basic injection attacks */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove basic HTML tags
        .substring(0, 1000); // Limit length
}


/** Format file size in human readable format */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}



/** Deep merge objects */
// export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
//   const result: T = { ...target };

//   for (const key in source) {
//     if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
//       result[key] = deepMerge(result[key] || {} as T[typeof key], source[key]);
//     } else {
//       result[key] = source[key] as T[typeof key];
//     }
//   }

//   return result;
// }


export const getRandomString = (len: number) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}

export const getChoiceItemAlphaInd = (index: number): string => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Single letter (0-25: A-Z)
    if (index < 26) {
        return alphabet[index] || '';
    }
    
    // Two letters (26-701: AA-ZZ)
    if (index < 702) {
        const adjusted = index - 26;
        const firstLetter = Math.floor(adjusted / 26);
        const secondLetter = adjusted % 26;
        return alphabet[firstLetter] + alphabet[secondLetter];
    }
    
    // Three letters (702+: AAA-ZZZ)
    const adjusted = index - 702;
    const firstLetter = Math.floor(adjusted / 676); // 26^2
    const secondLetter = Math.floor((adjusted % 676) / 26);
    const thirdLetter = adjusted % 26;
    return alphabet[firstLetter] + alphabet[secondLetter] + alphabet[thirdLetter];
}