import React, { FC } from 'react';

interface errorProps {
  error: string;
}

const errorStyle = {
  marginBottom: '1vh',
  fontSize: '1vh',
  color: 'red',
  whiteSpace: 'pre-line'
};

const CustomError: FC<errorProps> = ({ error }) => {
  return <p style={errorStyle}>{error}</p>;
};

export default CustomError;
