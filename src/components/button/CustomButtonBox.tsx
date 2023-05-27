import React, { FC } from 'react';

interface buttonProps {
  onPress: any;
  text: string;
}

const buttonBox = {
  width: '25vh',
  height: '25vh',
  fontSize: '2vh'
};

const CustomButtonBox: FC<buttonProps> = ({ onPress, text }) => {
  return (
    <button style={buttonBox} onClick={onPress} type="button">
      {text}
    </button>
  );
};

export default CustomButtonBox;
