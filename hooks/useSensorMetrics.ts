import { useEffect, useRef, useState } from "react";
import {
    accelerometer,
    setUpdateIntervalForType,
    SensorTypes
  } from "react-native-sensors";

setUpdateIntervalForType(SensorTypes.accelerometer, 100);

export default function useSensorMetrics() {
    const [metrics, setMetrics] = useState({ x: 0, y: 0, z: 0});
    const [high, setHigh] = useState(0);
    const [low, setLow] = useState(0);
    const [waveHeight, setWaveHeight] = useState(0);
    const [waveDiff, setWaveDiff] = useState(1);
    const [isInitializing, setIsInitializing] = useState(true);
    
    
    const sensorSubscriptionRef = useRef<any>();
    const motionQ = useRef<Array<number>>([]);

    useEffect(() => {
        let localQ = motionQ.current.slice();
        if (isInitializing) {
          localQ.push(metrics.z);
        } else {
          localQ.push(metrics.z);
          localQ.shift();
        }
    
          let max = -Infinity;
          let min = Infinity;
          localQ.forEach((el) => {
            if (el < min) {min = el}
            if (el > max) {max = el}
          });
          setHigh(max);
          setLow(min);
    
          const newWaveHeight = high - low;
          const newWaveDiff = newWaveHeight - waveHeight;
          setWaveDiff(newWaveDiff);
          setWaveHeight(newWaveHeight);
    
          motionQ.current = localQ;
      }, [metrics, isInitializing]);

      useEffect(() => {
        sensorSubscriptionRef.current = accelerometer.subscribe(({x, y, z}) => {
          setMetrics({x, y, z});
        });
    
        setTimeout(() => {
          setIsInitializing(false);
        }, 5000);
    
        
    
        return () => {
          sensorSubscriptionRef.current.unsubscribe();
          setIsInitializing(true);
          motionQ.current = [];
        }
      }, []);

      return {
        metrics,
        high,
        low,
        waveHeight,
        waveDiff,
        isInitializing
      };
}