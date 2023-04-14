import { useEffect, useState } from 'react';
import { TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const CONTENT_FIELD_ID = 'body';
const WORDS_PER_MINUTE = 160;

type contentType = {
  content: [
    {
      content: [
        {
          value: string;
        }
      ];
      nodeType: string;
    }
  ];
};

const readingTime = (content: contentType) => {
  let wordCount = 0;

  const INCLUDE_CONTENT = [
    'heading-2',
    'heading-3',
    'heading-4',
    'heading-5',
    'paragraph',
  ];

  if (content !== undefined) {
    content.content.forEach((paragraph) => {
      INCLUDE_CONTENT.includes(paragraph.nodeType) &&
        (wordCount += paragraph.content[0].value.split(' ').length);
    });
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

    return `${minutes} minute${minutes > 1 ? 's' : ''} read`;
  } else {
    return '0 minutes read';
  }
};

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const contentField = sdk.entry.fields[CONTENT_FIELD_ID];
  const [timeToRead, setTimeToRead] = useState('0 minutes read');

  useEffect(() => {
    const detach = contentField.onValueChanged((value) => {
      // console.log('detach', detach);
      const res = readingTime(value);
      setTimeToRead(res);
      sdk.field.setValue(res);
    });
    return () => detach();
  }, [contentField, sdk.field]);

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  return <TextInput name='time-read' value={timeToRead} isReadOnly={true} />;
};

export default Field;
