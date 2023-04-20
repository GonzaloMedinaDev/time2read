/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const WORDS_PER_MINUTE = 160;

interface TimeToReadType {
  body: number;
  body2: number;
}

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const fieldBody = sdk.entry.fields['body'];
  const fieldBody2 = sdk.entry.fields['body2'];
  const [timeMessage, setTimeMessage] = useState('');
  // const [timeToRead, setTimeToRead] = useState<TimeToReadType>({
  //   body: 0,
  //   body2: 0,
  // });

  const time2read: TimeToReadType = { body: 0, body2: 0 };

  useEffect(() => {
    // const scanBody = fieldBody.onValueChanged((value: undefined | string) => {
    //   value && setTimeToRead({ ...timeToRead, body: readingTime(value) });
    // });

    // const detach = () => {
    //   console.log('detach');
    //   scanBody();
    //   scanBody2();
    // };

    // return () => detach();

    fieldBody.onValueChanged((value: undefined | string) => {
      console.log('value1 => ', value?.length);
      console.log('time2read', time2read);

      time2read['body'] = value ? readingTime(value) : 0;
      updateMessage();
    });

    fieldBody2 &&
      fieldBody2.onValueChanged((value: undefined | string) => {
        console.log('value2 => ', value?.length);
        console.log('time2read', time2read);

        time2read['body2'] = value ? readingTime(value) : 0;
        updateMessage();
      });
  }, [fieldBody, fieldBody2]);

  useEffect(() => sdk.window.startAutoResizer(), []);

  const updateMessage = () => {
    let totalTime = 0;
    console.log('time2read X', time2read);

    Object.entries(time2read).forEach((value) => {
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
