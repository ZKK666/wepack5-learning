/**
 * Type definitions for console-cleaner-native
 */

/**
 * Removes specified console methods from source code
 * @param source - The source code string to process
 * @param methods - Array of console methods to remove (e.g., ['log', 'info', 'debug'])
 * @returns The processed source code with console statements removed
 *
 * @example
 * ```typescript
 * import { removeConsole } from '@yourname/console-cleaner-native';
 *
 * const source = `
 *   console.log('test');
 *   const result = 42;
 * `;
 *
 * const cleaned = removeConsole(source, ['log']);
 * // Returns: "const result = 42;"
 * ```
 */
export function removeConsole(source: string, methods: string[]): string;

/**
 * Options for console cleaning
 */
export interface ConsoleCleanOptions {
  /** Console methods to remove (default: ['log', 'info', 'debug']) */
  remove?: string[];
  /** Keep console.error and console.warn (default: true) */
  keepErrors?: boolean;
}

/**
 * Native addon module
 */
declare const nativeAddon: {
  removeConsole: typeof removeConsole;
};

export default nativeAddon;
