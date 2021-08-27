import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Audio } from "expo-av";
import useMeter from "./hooks/meteringHook";

export default function App() {
  const [recording, setRecording] = useState();
  const [targetLevel, setTargetLevel] = useState();
  const [intensity, setIntensity] = useState(0);
  const meter = useMeter(recording);

  useEffect(() => {
    if (!targetLevel && meter) {
      setTargetLevel(meter + (100 - meter) / 2);
    }
    if (meter > targetLevel) {
      setIntensity(Math.min(intensity + 1, 4));
    } else {
      setIntensity(Math.max(intensity - 1, 0));
    }
  }, [meter]);

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    const status = await recording.getStatusAsync();
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
  }

  return (
    <View style={styles.container}>
      <Text>Meter: {meter}</Text>
      <Text>Intensity: {intensity}</Text>
      <Button
        title={recording ? "Stop Listening" : "Start Listening"}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
});
