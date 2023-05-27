import React, { FC } from 'react';

interface inputProps {
  name: string;
  type: string;
  value: string;
  onPress: any;
  defaultValue: string;
}

const inputStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '35vh',
  height: '5vh',
  marginBottom: '1vh',
  marginTop: '1vh',
  border: '0.2vh solid #d6d1d5',
  fontSize: '2vh'
};

const CustomInputFilterProjectDep: FC<inputProps> = ({
  defaultValue,
  name,
  type,
  value,
  onPress
}) => {
  return (
    <input
      style={inputStyle}
      defaultValue={defaultValue}
      placeholder={name}
      name={name}
      type={type}
      value={value}
      onChange={onPress}
      required
    />
  );
};

export default CustomInputFilterProjectDep;
