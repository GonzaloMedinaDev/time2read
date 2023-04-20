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

const readingTime = (content: undefined | string): number => {
  let response = 0;

  if (content) {
    const wordCount = content.split(' ').length || 0;
    response = Math.ceil(wordCount / WORDS_PER_MINUTE);
  }

  return response;
};

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const fieldBody = sdk.entry.fields['body'];
  const fieldBody2 = sdk.entry.fields['body2'];
  const [timeMessage, setTimeMessage] = useState('');
  const [timeToRead, setTimeToRead] = useState<TimeToReadType>({
    body: 0,
    body2: 0,
  });

  const time2read: TimeToReadType = { body: 0, body2: 0 };

  // const updateTime = (field: string, data: number) => {
  //   console.log('timeToRead X', timeToRead);
  //   console.log('time2read', time2read);

  //   setTimeToRead({ ...timeToRead, [field]: data });

  //   if (field === 'body2') time2read['body'] = data;
  //   else if (field === 'body2') time2read['body2'] = data;
  // };

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
      // value && updateTime('body', readingTime(value));
      time2read['body'] = readingTime(value);
    });

    fieldBody2.onValueChanged((value: undefined | string) => {
      console.log('value2 => ', value?.length);
      console.log('time2read', time2read);
      // value && updateTime('body2', readingTime(value));
      time2read['body2'] = readingTime(value);
    });
  }, [fieldBody, fieldBody2]);

  useEffect(() => {
    let totalTime = 0;
    console.log('timeToRead', timeToRead);

    Object.entries(timeToRead).forEach((value) => (totalTime += value[1]));

    setTimeMessage(`${totalTime} minute${totalTime === 1 ? '' : 's'} read`);
    sdk.field.setValue(timeMessage);
  }, [timeToRead]);

  useEffect(() => sdk.window.startAutoResizer(), []);

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
