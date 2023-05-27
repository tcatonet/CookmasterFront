import React, { FC } from 'react';
import './button.css';

interface buttonProps {
  onPress: any;
  text: string;
}

const buttonStyle = {
  fontSize: '2vh',
  marginBottom: '1vh',
  width: '20vh',
  marginLeft: 'auto',
  marginRight: 'auto'

};

const CustomButtonInvoiceBack: FC<buttonProps> = ({ onPress, text }) => {
  return (
    <button style={buttonStyle} onClick={onPress} type="button">
      {text}
    </button>
  );
};

export default CustomButtonInvoiceBack;
