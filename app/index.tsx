import { useRef } from "react";
import { Button, Text, View } from "react-native";

import useAlert from "@/hooks/useAlert";
import useThresholdConfig from "@/hooks/useThresholdConfig";
import useSensorMetrics from "@/hooks/useSensorMetrics";


export default function Index() {
  const { isAlerting, setIsAlerting} = useAlert();
  const { threshold, Increment, Decrement } = useThresholdConfig();
  const {
    metrics,
    high,
    low,
    waveHeight,
    waveDiff,
    isInitializing
  } = useSensorMetrics();

  const prevWaveDiff = useRef<number>(0);


  if (!isInitializing) {
    const shouldAlert = Math.abs(waveDiff) > threshold;
    prevWaveDiff.current = waveDiff;
    if (shouldAlert && !isAlerting) {
      setIsAlerting(shouldAlert);
    }
  } else {
    prevWaveDiff.current = waveDiff;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isAlerting ? "red" : "lightblue",
      }}
    >
      <Text style={{ fontSize: 30 }}>Floaty App</Text>

      <Text>Alerting: {isAlerting ? "True" : "False"}</Text>

      <Text style={{ fontWeight: "bold"}}>Configure</Text>
      <View style={{ flexDirection: "row" }}>
        <Button title="-" onPress={Decrement} />
        <Text style={{ margin: 10 }}>{`Threshold: ${threshold.toFixed(1)}`}</Text>
        <Button title="+" onPress={Increment} />
      </View>

      <View style={{ marginVertical: 40 }}>
        <Text style={{ fontWeight: 'bold' }}>Metrics:</Text>
        <Text>{`x: ${metrics.x.toFixed(3)}, y: ${metrics.y.toFixed(3)}, z: ${metrics.z.toFixed(3)}`}</Text>
      </View>
      {isInitializing 
        ? <Text>Calibrating...</Text>
        : <>
            <Text>{`High Point: ${high.toFixed(3)}`}</Text>
            <Text>{`Low Point: ${low.toFixed(3)}`}</Text>
            <Text>{`Wave Height: ${waveHeight.toFixed(3)}`}</Text>
            <Text>{`Wave Diff: ${waveDiff.toFixed(2)}`}</Text>
          </>}
    </View>
  );
}
