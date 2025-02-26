import { useEffect, useState } from 'react';
import { TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

const CONTENT_FIELD_ID = 'bodyRt';
const WORDS_PER_MINUTE = 160;

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const fieldBody = sdk.entry.fields[CONTENT_FIELD_ID];
  const [timeToRead, setTimeToRead] = useState('0 min read');

  useEffect(() => {
    fieldBody.onValueChanged((value) => {
      setTimeToRead(readingTime(documentToPlainTextString(value)));
      console.log('@@ timeToRead', timeToRead);
    });
  }, [fieldBody]);

  useEffect(() => sdk.window.startAutoResizer(), [sdk.window]);

  return <TextInput name='time-read' value={timeToRead} isReadOnly={true} />;
};

export default Field;

const readingTime = (content: string): string => {
  const wordCount = content !== undefined ? content.split(' ').length : 0;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return `${minutes} min read`;
};
