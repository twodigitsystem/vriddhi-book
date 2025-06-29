// Global app configuration constants
export const APP_NAME = "Vriddhi Book";
export const APP_DESCRIPTION =
  "A comprehensive solution for managing your business needs, from invoicing to inventory and sales.";
export const APP_VERSION = "1.0.0";
export const APP_AUTHOR = "Vriddhi Book Team";
export const APP_COPYRIGHT = `© ${new Date().getFullYear()} Vriddhi Book. All rights reserved.`;
export const APP_LOGO_URL = "/logo.png"; // Path to your app logo
export const APP_FAVICON_URL = "/favicon.ico"; // Path to your app favicon
export const APP_THEME_COLOR = "#ffffff"; // Default theme color
export const APP_PRIMARY_COLOR = "#4a90e2"; // Primary color for your app
export const APP_SECONDARY_COLOR = "#50e3c2"; // Secondary color for your app
export const APP_ERROR_LOGGING_URL = "https://your-error-logging-service.com"; // URL for error logging service
export const APP_SUPPORT_EMAIL = "support@vriddhibook.com"; // Support email for your app
export const APP_PRIVACY_POLICY_URL = "/privacy-policy"; // URL to your privacy policy
export const APP_TERMS_OF_SERVICE_URL = "/terms-of-service"; // URL to your terms of service
export const APP_CONTACT_URL = "/contact"; // URL for contact page
export const APP_SOCIAL_MEDIA = {
  facebook: "https://facebook.com/yourpage",
  twitter: "https://twitter.com/yourprofile",
  instagram: "https://instagram.com/yourprofile",
  linkedin: "https://linkedin.com/in/yourprofile",
  github: "https://github.com/vriddhi-book",
  youtube: "https://youtube.com/yourchannel",
  pinterest: "https://pinterest.com/yourprofile",
  reddit: "https://reddit.com/user/yourprofile",
  snapchat: "https://snapchat.com/add/yourprofile",
  whatsapp: "https://wa.me/yourphonenumber",
  discord: "https://discord.gg/yourserver",
  telegram: "https://t.me/yourchannel",
};
export const APP_ANALYTICS_ID = "UA-XXXXXXXXX-X"; // Google Analytics ID or other analytics service ID
export const APP_FEATURES = [
  "Feature 1: Description of feature 1",
  "Feature 2: Description of feature 2",
  "Feature 3: Description of feature 3",
];
export const APP_FAQ = [
  {
    question: "What is YourAppName?",
    answer:
      "YourAppName is a comprehensive solution for managing your business needs.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply sign up and follow the onboarding process to set up your profile.",
  },
  {
    question: "Where can I find support?",
    answer: `You can reach out to us at ${APP_SUPPORT_EMAIL} or visit our support page.`,
  },
  {
    question: "What are the terms of service?",
    answer: `Please read our terms of service at ${APP_TERMS_OF_SERVICE_URL}.`,
  },
  {
    question: "How do I contact you?",
    answer: `You can contact us through our contact page at ${APP_CONTACT_URL}.`,
  },
];
export const APP_ONBOARDING_STEPS = [
  "Create an account",
  "Set up your business profile",
  "Customize your settings",
  "Explore features",
  "Start using the app",
];
export const APP_ONBOARDING_COMPLETED_MESSAGE =
  "Thank you for completing the onboarding process! You can now start using the app.";
export const APP_ONBOARDING_INCOMPLETE_MESSAGE =
  "It seems you haven't completed the onboarding process yet. Please fill out your business profile to get started.";
export const APP_ONBOARDING_REDIRECT_URL = "/dashboard"; // URL to redirect after onboarding completion

export const APP_CONFIG = {
  MAX_FILE_SIZE: 1024 * 1024 * 4, // 4MB
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  API_TIMEOUT: 5000,
} as const;

export const APP_DEFAULT_LANGUAGE = "en"; // Default language for the app
export const APP_SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
];
export const APP_DEFAULT_TIMEZONE = "UTC"; // Default timezone for the app
export const APP_SUPPORTED_TIMEZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
  "America/Los_Angeles",
  "Europe/Berlin",
  "Asia/Kolkata",
  "America/Sao_Paulo",
  "Africa/Johannesburg",
];
export const APP_DEFAULT_CURRENCY = "USD"; // Default currency for the app
export const APP_SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", name: "United States Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
];
export const APP_DEFAULT_DATE_FORMAT = "YYYY-MM-DD"; // Default date format for the app
export const APP_SUPPORTED_DATE_FORMATS = [
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "DD-MM-YYYY",
  "MM-DD-YYYY",
  "YYYY/MM/DD",
  "YYYY.MM.DD",
];
export const APP_DEFAULT_TIME_FORMAT = "HH:mm"; // Default time format for the app
export const APP_SUPPORTED_TIME_FORMATS = [
  "HH:mm",
  "hh:mm A",
  "HH:mm:ss",
  "hh:mm:ss A",
  "HH:mm:ss.SSS",
  "hh:mm:ss.SSS A",
];
export const APP_DEFAULT_DATETIME_FORMAT = "YYYY-MM-DD HH:mm"; // Default datetime format for the app
export const APP_SUPPORTED_DATETIME_FORMATS = [
  "YYYY-MM-DD HH:mm",
  "DD/MM/YYYY HH:mm",
  "MM/DD/YYYY HH:mm",
  "DD-MM-YYYY HH:mm",
  "MM-DD-YYYY HH:mm",
  "YYYY/MM/DD HH:mm",
  "YYYY.MM.DD HH:mm",
];
export const APP_DEFAULT_NUMBER_FORMAT = "0,0.00"; // Default number format for the app
export const APP_SUPPORTED_NUMBER_FORMATS = [
  "0,0.00",
  "0.00",
  "0,0",
  "0.0",
  "0,0.000",
  "0.000",
  "0%",
  "0.00%",
  "0,0%",
];

export const APP_DEFAULT_FONT = "Arial, sans-serif"; // Default font for the app
export const APP_SUPPORTED_FONTS = [
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Times New Roman, serif",
  "Georgia, serif",
  "Courier New, monospace",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "Trebuchet MS, sans-serif",
  "Impact, sans-serif",
  "Comic Sans MS, cursive",
];
export const APP_DEFAULT_THEME = "light"; // Default theme for the app
export const APP_SUPPORTED_THEMES = [
  "light",
  "dark",
  "system", // Follows system preference
];

export const APP_CONSTANTS = {
  API_ENDPOINT: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
} as const;
