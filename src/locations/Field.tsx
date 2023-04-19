import { useEffect, useState } from 'react';
import { TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const WORDS_PER_MINUTE = 160;

interface TimeToReadType {
  body: number;
  body2: number;
}

const readingTime = (content: string): number => {
  const wordCount = content.split(' ').length || 0;
  return Math.ceil(wordCount / WORDS_PER_MINUTE) || 0;
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

  useEffect(() => {
    sdk.window.startAutoResizer();

    // const scanBody = fieldBody.onValueChanged((value: undefined | string) => {
    //   value && setTimeToRead({ ...timeToRead, body: readingTime(value) });
    // });

    fieldBody.onValueChanged((value: undefined | string) => {
      console.log('value1 => ', value?.length);
      value && setTimeToRead({ ...timeToRead, body: readingTime(value) });
    });

    fieldBody2.onValueChanged((value: undefined | string) => {
      console.log('value2 => ', value?.length);
      value && setTimeToRead({ ...timeToRead, body2: readingTime(value) });
    });

    // const detach = () => {
    //   console.log('detach');
    //   scanBody();
    //   scanBody2();
    // };

    // return () => detach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldBody, fieldBody2]);

  useEffect(() => {
    console.log('timeToRead', timeToRead);
    // const totalTime = timeToRead.body + timeToRead.body2;
    let totalTime = 0;

    Object.entries(timeToRead).forEach((value) => (totalTime += value[1]));

    setTimeMessage(`${totalTime} minute${totalTime === 1 ? '' : 's'} read`);
    sdk.field.setValue(timeMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeToRead]);

  useEffect(() => {
    console.log('big load');
  }, []);

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
