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
  const [timeToRead, setTimeToRead] = useState(0);
  const [timeMessage, setTimeMessage] = useState('');

  const updateMessage = useCallback(
    (time: number) => {
      setTimeToRead(timeToRead + time);
      setTimeMessage(`${timeToRead} minute${timeToRead > 1 ? 's' : ''} read`);
      sdk.field.setValue(timeMessage);
    },
    [sdk.field, timeMessage, timeToRead]
  );

  useEffect(() => {
    sdk.window.startAutoResizer();

    console.log('fieldBody => ', fieldBody);
    console.log('fieldBody2 => ', fieldBody2);

    const scanBody = fieldBody.onValueChanged((value: undefined | string) => {
      console.log('value => ', value);

      value && updateMessage(readingTime(value));
    });

    const scanBody2 = fieldBody2.onValueChanged((value: undefined | string) => {
      console.log('value2 => ', value);

      value && updateMessage(readingTime(value));
    });

    const detach = () => {
      scanBody();
      scanBody2();
    };

    return () => detach();
  }, [fieldBody, fieldBody2, sdk.window, updateMessage]);

  // useEffect(() => {
  //   setTtimeMessage(`${timeToRead} minute${timeToRead > 1 ? 's' : ''} read`);
  // }, [timeToRead]);

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
