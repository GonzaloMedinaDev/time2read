/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

interface TimeToReadType {
  body: number;
  body2: number;
  desktopSteps: number;
  iosSteps: number;
  androidSteps: number;
}

const WORDS_PER_MINUTE = 160;

const TIME2READ: TimeToReadType = {
  body: 0,
  body2: 0,
  desktopSteps: 0,
  iosSteps: 0,
  androidSteps: 0,
};

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const fieldBody = sdk.entry.fields['body'];
  const fieldBody2 = sdk.entry.fields['body2'];
  const fieldDesktop = sdk.entry.fields['desktopSteps'];
  const fieldIOS = sdk.entry.fields['iosSteps'];
  const fieldAndroid = sdk.entry.fields['androidSteps'];
  const [timeMessage, setTimeMessage] = useState('');

  useEffect(() => {
    fieldBody.onValueChanged((value: undefined | string) => {
      TIME2READ['body'] = value ? readingTime(value) : 0;
      updateMessage();
    });

    fieldBody2 &&
      fieldBody2.onValueChanged((value: undefined | string) => {
        TIME2READ['body2'] = value ? readingTime(value) : 0;
        updateMessage();
      });

    fieldDesktop &&
      fieldDesktop.onValueChanged((value: undefined | string) => {
        TIME2READ['desktopSteps'] = value ? readingTime(value) : 0;
        updateMessage();
      });

    fieldIOS &&
      fieldIOS.onValueChanged((value: undefined | string) => {
        TIME2READ['iosSteps'] = value ? readingTime(value) : 0;
        updateMessage();
      });

    fieldAndroid &&
      fieldAndroid.onValueChanged((value: undefined | string) => {
        TIME2READ['androidSteps'] = value ? readingTime(value) : 0;
        updateMessage();
      });
  }, [fieldBody, fieldBody2, fieldDesktop, fieldIOS, fieldAndroid]);

  useEffect(() => sdk.window.startAutoResizer(), []);

  const updateMessage = () => {
    let totalTime = 0;
    console.log('TIME2READ X', TIME2READ);

    Object.entries(TIME2READ).forEach((value) => {
      console.log('valuessss => ', value[1]);
      totalTime += value[1];
    });

    setTimeMessage(`${totalTime} minute${totalTime === 1 ? '' : 's'} read`);
    sdk.field.setValue(timeMessage);
  };

  return (
    <TextInput
      defaultValue={timeMessage}
      isReadOnly
      name='time-read'
      type='text'
      value={timeMessage}
    />
  );
};

export default Field;

const readingTime = (content: string): number => {
  const wordCount = content.split(' ').length || 0;
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
};
