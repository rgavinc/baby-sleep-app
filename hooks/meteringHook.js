import { useState, useEffect } from "react";

export default (recording) => {
  const [meter, setMeter] = useState(0);

  useEffect(() => {
    if (recording) calculateMeter();
  }, [recording]);

  const calculateMeter = async () => {
    const { metering } = await recording.getStatusAsync();
    setTimeout(() => {
      const result = (160 + metering) * 0.625;
      setMeter(result);
      calculateMeter();
    }, 500);
  };

  return meter;
};
