import { useCallback, useEffect, useState } from 'react';
import { TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const WORDS_PER_MINUTE = 160;

const readingTime = (content: string): number => {
  let wordCount = 0;

  wordCount = content.split(' ').length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  const response = minutes || 0;

  return response;
};

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const fieldBody = sdk.entry.fields['body'];
  const fieldBody2 = sdk.entry.fields['body2'];
  const [timeToRead, setTimeToRead] = useState({
    body: 0,
    body2: 0,
  });
  const [timeMessage, setTimeMessage] = useState('');

  useEffect(() => {
    sdk.window.startAutoResizer();

    const scanBody = fieldBody.onValueChanged((value: undefined | string) => {
      if (value) {
        console.log('body', readingTime(value));
        setTimeToRead({ ...timeToRead, body: readingTime(value) });
      }
    });

    const scanBody2 = fieldBody2.onValueChanged((value: undefined | string) => {
      if (value) {
        console.log('body2', readingTime(value));
        setTimeToRead({ ...timeToRead, body2: readingTime(value) });
      }
    });

    const detach = () => {
      scanBody();
      scanBody2();
    };

    return () => detach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldBody, fieldBody2]);

  // , sdk.field, sdk.window

  useEffect(() => {
    console.log('timeToRead', timeToRead);
    const totalTime = timeToRead.body + timeToRead.body2;
    setTimeMessage(`${totalTime} minute${totalTime === 1 ? '' : 's'} read`);
    sdk.field.setValue(timeMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeToRead]);

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
