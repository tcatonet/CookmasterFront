import React, { FC } from 'react';
import showPwdImg from '../../assets/logoPassword/show-password.svg';
import hidePwdImg from '../../assets/logoPassword/hide-password.svg';
import './password.css';

interface inputPasswordProps {
  password: string;
  placeholder: string;
  onPress: any;
}

const inputStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1vh',
  width: '42vh',
  height: '5vh',
  padding: '1vh 1vh',
  borderRadius: '1vh',
  border: '0.2vh solid #d6d1d5',
  fontSize: '2vh'
};

const CustomPasswordInput: FC<inputPasswordProps> = ({ password, placeholder, onPress }) => {
  const [isRevealPwd, setIsRevealPwd] = React.useState(false);

  return (
    <div className="pwd-container">
      <input
        style={inputStyle}
        placeholder={placeholder}
        name="password"
        type={isRevealPwd ? 'text' : 'password'}
        value={password}
        onChange={onPress}
        required
      />
      <img
        title={isRevealPwd ? 'Hide password' : 'Show password'}
        src={isRevealPwd ? hidePwdImg : showPwdImg}
        onClick={() => setIsRevealPwd((prevState) => !prevState)}
        alt="Show/hide"
      />
    </div>
  );
};

export default CustomPasswordInput;
