// Store configuration
// This file is prepared for Pinia integration
// To use Pinia, install: npm install pinia
// Then uncomment and configure below:

/*
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia
*/

// Temporary simple store pattern
export const useStore = () => {
  const state = {
    // Add your global state here
  }

  return {
    state
  }
}
