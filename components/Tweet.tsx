import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

const Tweet = (props) => {
  const { id, image, username, text, timeStamp } = props;
  return (
    <div
      key={id}
      className="px-4 py-3 border-b border-gray-200"
    >
      <div className="flex flex-row">
        <div className="w-1/12 mr-3">
          <Image
            src={image}
            alt=""
            width={200}
            height={200}
            className="w-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col w-5/6">
          <p className="text-sm">
            <span className="font-bold mr-3">
              {username}
            </span>
            <span className="text-gray-500">
              {format(timeStamp, 'PPpp')}
            </span>
          </p>
          <p className="text-sm">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Tweet);
