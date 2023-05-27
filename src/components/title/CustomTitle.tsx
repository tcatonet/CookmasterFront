import React, { FC } from 'react';

interface titleProps {
  title: string;
}

const titleForm = {
  marginBottom: '3vh',
  fontSize: '3vh',
  display: 'flex',
  justifyContent: 'center',
  fontWeight: 'lighter'
};

const CustomTitle: FC<titleProps> = ({ title }) => {
  return <h1 style={titleForm}>{title}</h1>;
};

export default CustomTitle;
