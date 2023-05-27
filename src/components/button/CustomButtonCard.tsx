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
  marginTop: '1Vh',
  padding: '0vh',
  marginLeft: '2vh',
  marginRight: '1vh'
};

const CustomButtonCard: FC<buttonProps> = ({ onPress, text }) => {
  return (
    <button style={buttonStyle} onClick={onPress} type="button">
      {text}
    </button>
  );
};

export default CustomButtonCard;
