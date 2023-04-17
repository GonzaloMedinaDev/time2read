import { useEffect, useState } from 'react';
import { TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const CONTENT_FIELD_ID = 'body';
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
  const contentField = sdk.entry.fields[CONTENT_FIELD_ID];
  const [timeToRead, setTimeToRead] = useState('0 minutes read');

  useEffect(() => {
    sdk.window.startAutoResizer();

    console.log('contentField => ', contentField);

    const detach = contentField.onValueChanged((value: undefined | string) => {
      const res = readingTime(value);
      setTimeToRead(res);
      sdk.field.setValue(res);
    });

    return () => detach();
  }, [contentField, sdk.field, sdk.window]);

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
