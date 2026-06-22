import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn = "class names". Combines conditional class names (via clsx) and then
 * resolves conflicting Tailwind utilities so the last one wins (via twMerge).
 *
 * Example: cn("px-2", isLarge && "px-4") -> "px-4" when isLarge is true.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
