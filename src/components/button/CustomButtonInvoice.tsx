import React, { FC } from 'react';
import './button.css';

interface buttonProps {
  onPress: any;
  text: string;
}

const buttonStyle = {
  fontSize: '1.5vh',
  width: '15vh',
  height: '4vh',
  marginTop: '3Vh',
  padding: '0vh'
};

const CustomButtonInvoice: FC<buttonProps> = ({ onPress, text }) => {
  return (
    <button style={buttonStyle} onClick={onPress} type="button">
      {text}
    </button>
  );
};

export default CustomButtonInvoice;
