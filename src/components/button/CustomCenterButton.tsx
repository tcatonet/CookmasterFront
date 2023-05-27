import React, { FC } from 'react';
import './button.css';

interface buttonProps {
  onPress: any;
  text: string;
}

const buttonStyle = {
  fontSize: '2vh',
  padding: '1.5vh',
  marginTop: '3vh',
  marginBottom: '1vh',
  marginLeft: 'auto',
  marginRight: 'auto'
};

const CustomCenterButton: FC<buttonProps> = ({ onPress, text }) => {
  return (
    <button style={buttonStyle} onClick={onPress} type="button">
      {text}
    </button>
  );
};

export default CustomCenterButton;
