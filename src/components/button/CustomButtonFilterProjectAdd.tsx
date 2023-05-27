import React, { FC } from 'react';
import './button.css';

interface buttonProps {
  onPress: any;
  text: string;
}

const buttonStyle = {
  fontSize: '2vh',
  bottom: '0px',
  position: 'fixed',
  width: '35vh',
  marginLeft: 'auto',
  marginRight: 'auto'
};

const CustomButtonFilterProjectAdd: FC<buttonProps> = ({ onPress, text }) => {
  return (
    <button style={buttonStyle} onClick={onPress} type="button">
      {text}
    </button>
  );
};

export default CustomButtonFilterProjectAdd;
