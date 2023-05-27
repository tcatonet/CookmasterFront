import React, { FC } from 'react';

interface errorProps {
  name: string;
  value: string;
}

const labelForm = {
  fontSize: '2vh',
  marginBottom: '0.5vh',
  color: '#444'
};

const CustomLabel: FC<errorProps> = ({ name, value }) => {
  return (
    <label style={labelForm}>
      {name} {value}
    </label>
  );
};
export default CustomLabel;
