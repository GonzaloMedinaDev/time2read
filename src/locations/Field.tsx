import { useEffect, useState } from 'react';
import { TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const WORDS_PER_MINUTE = 160;

const readingTime = (content: undefined | string) => {
  let wordCount = 0;
  let response = '0 minutes read';

  if (content !== undefined) {
    wordCount += content.split(' ').length;
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    response = `${minutes} minute${minutes > 1 ? 's' : ''} read`;
  }

  return response;
};

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const fieldBody = sdk.entry.fields['body'];
  const fieldBody2 = sdk.entry.fields['body2'];
  const [timeToRead, setTimeToRead] = useState('0 minutes read');

  useEffect(() => {
    sdk.window.startAutoResizer();

    console.log('fieldBody => ', fieldBody);
    console.log('fieldBody2 => ', fieldBody2);

    const scanBody = fieldBody.onValueChanged((value: undefined | string) => {
      console.log('value => ', value);

      const res = readingTime(value);
      setTimeToRead(res);
      sdk.field.setValue(res);
    });

    const scanBody2 = fieldBody2.onValueChanged((value: undefined | string) => {
      console.log('value2 => ', value);

      // const res = readingTime(value);
      // setTimeToRead(res);
      // sdk.field.setValue(res);
    });

    const detach = () => {
      scanBody();
      scanBody2();
    };

    return () => detach();
  }, [fieldBody, fieldBody2, sdk.field, sdk.window]);

  return (
    <TextInput
      defaultValue={timeToRead}
      isReadOnly
      name='time-read'
      type='text'
      value={timeToRead}
    />
  );
};

export default Field;
