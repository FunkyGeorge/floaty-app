import { useEffect, useRef, useState } from "react";
import Sound from "react-native-sound";

export default function useAlert() {
    const [isAlerting, setIsAlerting] = useState(false);
    const alertID = useRef<any>();

    const sweetAlertSound = new Sound("sweetalert.wav", Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
      });

    useEffect(() => {
        alertID.current = setInterval(() => {
          if (isAlerting) {
            console.log("trying to play sound");
            sweetAlertSound.play((success) => {
              console.log(success);
            });
          }
        }, 1000);
    
        return () => {
          clearInterval(alertID.current);
        };
      }, []);

      return {
        isAlerting,
        setIsAlerting
      };
}