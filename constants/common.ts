import { CountryOption } from "@/types/common";

export const COUNTRIES: CountryOption[] = [
    { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
    { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
    { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
    { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
    { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
    { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "JP", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "CN", dialCode: "+86", name: "China", flag: "🇨🇳" },
    { code: "BR", dialCode: "+55", name: "Brazil", flag: "🇧🇷" },
    { code: "ZA", dialCode: "+27", name: "South Africa", flag: "🇿🇦" },
    { code: "NG", dialCode: "+234", name: "Nigeria", flag: "🇳🇬" },
    { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
    { code: "SG", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "ES", dialCode: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "IT", dialCode: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "SE", dialCode: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "NL", dialCode: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "CH", dialCode: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "MX", dialCode: "+52", name: "Mexico", flag: "🇲🇽" },
];

export const REGEX = {
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

export const THEMES = {
    light: 'light',
    dark: 'dark',
    system: 'system'
}