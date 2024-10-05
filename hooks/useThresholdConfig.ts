import { useState } from 'react';

export default function useThresholdConfig() {
    // Configurable
    const [threshold, setThreshold] = useState(1);
    const thresholdStep = 0.2;

    const Increment = () => {
        setThreshold(threshold + thresholdStep);
      }
    
      const Decrement = () => {
        setThreshold(threshold - thresholdStep);
      }

    return {
        threshold,
        Increment,
        Decrement
    };
}