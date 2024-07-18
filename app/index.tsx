import { useEffect, useState, useRef } from "react";
import { Text, View } from "react-native";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import Sound from "react-native-sound";

setUpdateIntervalForType(SensorTypes.accelerometer, 100);

export default function Index() {
  const [metrics, setMetrics] = useState({ x: 0, y: 0, z: 0});
  const [isAlerting, setIsAlerting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [high, setHigh] = useState(0);
  const [low, setLow] = useState(0);
  const sensorSubscriptionRef = useRef<any>();

  const initialQ: Array<number> = [];
  const [motionQ, setMotionQ] = useState(initialQ);

  const sweetAlertSound = new Sound("sweet_alert.wav", Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  });

  function tick() {
    let localQ = motionQ.slice();
    if (isInitializing) {
      localQ.push(metrics.z);
      setMotionQ(localQ);
    } else {
      localQ.push(metrics.z);
      localQ.shift();

      let max = -Infinity;
      let min = Infinity;
      localQ.forEach((el) => {
        if (el < min) {min = el}
        if (el > max) {max = el}
      });
      console.log(min, max);
      setHigh(max);
      setLow(min);
      setMotionQ(localQ);

      const threshold = 1;

      setIsAlerting(Math.abs(high - low) > threshold);
    }
  };

  useEffect(() => {
    sensorSubscriptionRef.current = accelerometer.subscribe(({ x, y, z }) => {
      setMetrics({x, y, z});
    });

    const tickInterval = setInterval(tick, 1000);

    setTimeout(() => {
      setIsInitializing(false);
    }, 5000);

    return () => {
      sensorSubscriptionRef.current.unsubscribe();
      clearInterval(tickInterval);
    }
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      console.log("trying to play sound");
      sweetAlertSound.play((success) => {
        console.log(success);
      });
    }
  }, [isAlerting]);


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <Text>Alerting: {isAlerting ? "True" : "False"}</Text>
      <Text>{`x: ${metrics.x.toFixed(3)}, y: ${metrics.y.toFixed(3)}, z: ${metrics.z.toFixed(3)}`}</Text>
      {!isInitializing && 
        <Text>{`high: ${high}, low: ${low}`}</Text>}
    </View>
  );
}
