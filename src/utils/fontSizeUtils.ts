import { useFontSize } from '../context/FontSizeContext';

/**
 * Hook to get font size classes for components
 * @returns Object with font size classes for different text elements
 */
export const useFontSizeClasses = () => {
  const { fontSize } = useFontSize();
  
  return {
    // Base font size class
    base: `font-size-${fontSize}`,
    
    // Text size classes
    text: {
      xs: `text-xs font-size-${fontSize}`,
      sm: `text-sm font-size-${fontSize}`,
      base: `text-base font-size-${fontSize}`,
      lg: `text-lg font-size-${fontSize}`,
      xl: `text-xl font-size-${fontSize}`,
      '2xl': `text-2xl font-size-${fontSize}`,
      '3xl': `text-3xl font-size-${fontSize}`,
    },
    
    // Heading classes
    heading: {
      h1: `text-2xl font-bold font-size-${fontSize}`,
      h2: `text-xl font-semibold font-size-${fontSize}`,
      h3: `text-lg font-semibold font-size-${fontSize}`,
      h4: `text-base font-medium font-size-${fontSize}`,
      h5: `text-sm font-medium font-size-${fontSize}`,
      h6: `text-xs font-medium font-size-${fontSize}`,
    },
    
    // Button classes
    button: {
      sm: `text-sm font-medium font-size-${fontSize}`,
      base: `text-base font-medium font-size-${fontSize}`,
      lg: `text-lg font-medium font-size-${fontSize}`,
    },
    
    // Input classes
    input: `text-base font-size-${fontSize}`,
    
    // Label classes
    label: `text-sm font-medium font-size-${fontSize}`,
    
    // Current font size for conditional styling
    currentSize: fontSize,
  };
};

/**
 * Utility function to get responsive font size classes
 * @param baseSize - Base font size (small, medium, large)
 * @returns Responsive font size classes
 */
export const getResponsiveFontSize = (baseSize: 'small' | 'medium' | 'large') => {
  const sizeMap = {
    small: {
      base: 'text-sm',
      sm: 'text-xs',
      lg: 'text-base',
      xl: 'text-lg',
    },
    medium: {
      base: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    large: {
      base: 'text-lg',
      sm: 'text-base',
      lg: 'text-xl',
      xl: 'text-2xl',
    },
  };
  
  return sizeMap[baseSize];
};

/**
 * Utility function to apply font size to a specific element
 * @param element - HTML element to apply font size to
 * @param size - Font size to apply
 */
export const applyFontSizeToElement = (element: HTMLElement, size: 'small' | 'medium' | 'large') => {
  // Remove existing font size classes
  element.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
  // Add new font size class
  element.classList.add(`font-size-${size}`);
}; 