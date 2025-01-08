import { getData } from '@/helpers/storage';
import { createContext, useContext, useState } from 'react';
import * as ScreenCapture from 'expo-screen-capture';

type ScreenShotContextProps = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const PreventScreenShotContext = createContext<ScreenShotContextProps | []>([]);

const PreventScreenShotProvider = ({ children }: { children: React.ReactNode }) => {
  const [isScreenShotDisabled, setIsScreenShotDisabled] = useState(false);

  getData('isScreenShotDisabled').then((data: boolean) => {
    if (data !== undefined) {
      setIsScreenShotDisabled(data);
      data ? activatePreventScreenShot() : disablePreventScreenShot();
    } else {
      disablePreventScreenShot();
    }
  });

  const activatePreventScreenShot = async () => {
    await ScreenCapture?.preventScreenCaptureAsync('screenshot');
  };

  const disablePreventScreenShot = async () => {
    await ScreenCapture?.allowScreenCaptureAsync('screenshot');
  };

  return <PreventScreenShotContext.Provider value={[isScreenShotDisabled, setIsScreenShotDisabled]}>{children}</PreventScreenShotContext.Provider>;
};

export default PreventScreenShotProvider;

export const usePreventScreenShotContext = (): ScreenShotContextProps => {
  const [isScreenShotDisabled, setIsScreenShotDisabled] = useContext(PreventScreenShotContext);

  if (isScreenShotDisabled === undefined || setIsScreenShotDisabled === undefined) {
    throw new Error('Custom Error: isScreenShotDisabled or setIsScreenShotDisabled is undefined');
  }

  return [isScreenShotDisabled, setIsScreenShotDisabled];
};
