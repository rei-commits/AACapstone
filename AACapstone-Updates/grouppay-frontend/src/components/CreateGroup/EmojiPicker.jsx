import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const EmojiPicker = ({ onSelect }) => {
  return (
    <div className="absolute mt-2 z-50">
      <Picker 
        data={data} 
        onEmojiSelect={(emoji) => onSelect(emoji.native)}
        theme="light"
        set="apple"
      />
    </div>
  );
};

export default EmojiPicker; 