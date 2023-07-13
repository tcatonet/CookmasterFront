//Thomas Catonet
//VERSION 1.0
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

import '../style/style.css';

import CustomButton from '../components/button/CustomButton';
import CustomInput from '../components/input/CustomInput';
import CustomPasswordInput from '../components/input/CustomPasswordInput';
import CustomTitle from '../components/title/CustomTitle';
import CustomError from '../components/error/CustomError';

import { expressionEmail, expressionPassword } from '../assets/regex/regex';
import tradContent from '../assets/traduction/dictionary';
import Axios from '../axios_config';
import Loader from '../components/loader/Loader';
import NavbarLogin from '../components/navbar/NavbarLogin';
import saveToken from '../components/sessionManager/saveToken';
import { SIGN_IN, CONFIRMATION_EMAIL } from '../components/navbar/Root';

export default function SignUpView() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordBis, setPasswordBis] = React.useState('');
  const [usernameError, setUsernameError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [passwordBisError, setPasswordBisError] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [globalError, setGlobalError] = React.useState('');
  const [language, setLanguage] = React.useState('');

  let navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  function cancel() {
    navigate(SIGN_IN);
  }

  const newUser = {
    username: username,
    email: email,
    password: password
  };

  function testSignUpForm() {
    var error = false;

    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setPasswordBisError('');

    if (!expressionEmail.test(String(email).toLowerCase())) {
      setEmailError(tradContent['emailErrorFormat'][language]);
      error = true;
    }

    if (!expressionPassword.test(String(password))) {
      setPasswordBisError(tradContent['passwordErrorFormat'][language]);
      error = true;
    }

    if (username === '') {
      setUsernameError(tradContent['usernameErrorNone'][language]);
      error = true;
    }

    if (email === '') {
      setEmailError(tradContent['emailErrorNone'][language]);
      error = true;
    }

    if (password === '') {
      setPasswordError(tradContent['passwordErrorNone'][language]);
      error = true;
    }

    if (passwordBis === '') {
      setPasswordBisError(tradContent['passwordBisErrorNone'][language]);
      error = true;
    }

    if (passwordBis !== password) {
      setPasswordBisError(tradContent['passwordBisErrorNotEqual'][language]);
      error = true;
    }

    if (username.length > 100) {
      setUsernameError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (email.length > 100) {
      setEmailError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (password.length > 100) {
      setPasswordError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (passwordBis.length > 100) {
      setPasswordBisError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  function createAccount() {
    if (!testSignUpForm()) {
      setShowLoader(true);
      Axios.post('/user', newUser, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(async (res) => {
          const data = res.data;
          console.log('COUCOUCOUCOU')
          console.log(data)
          console.log(res.status)

          if (res.status==201) {
            console.log('IN 201')
            saveToken(data['refresh_token']);
            console.log('IN 201 2')



            setShowLoader(false);
            console.log('IN 201 3')


            navigate(CONFIRMATION_EMAIL);
            console.log('IN 201 4')



          } else {
            setShowLoader(false);
            setGlobalError(data['error']);
          }
        })
        .catch(() => {
          setShowLoader(false);
          toast.error(tradContent['internalError'][language]);
        });
    }
  }

  return (
    <>
      <Toaster />
      <NavbarLogin />
      <div>
        {showLoader ? <Loader /> : null}
        {!showLoader ? (
          <form className="popup">
            <CustomTitle title={tradContent['createAccountTitle'][language]} />

            <CustomInput
              name={tradContent['nameLabel'][language]}
              type="username"
              value={username}
              onPress={(e) => setUsername(e.target.value)}
            />
            <CustomError error={usernameError} />

            <CustomInput
              name={tradContent['emailLabel'][language]}
              type="email"
              value={email}
              onPress={(e) => setEmail(e.target.value)}
            />
            <CustomError error={emailError} />

            <CustomPasswordInput
              placeholder={tradContent['passwordIn'][language]}
              password={password}
              onPress={(e) => setPassword(e.target.value)}
            />
            <CustomError error={passwordError} />

            <CustomPasswordInput
              placeholder={tradContent['passwordAgainIn'][language]}
              password={passwordBis}
              onPress={(e) => setPasswordBis(e.target.value)}
            />
            <CustomError error={passwordBisError} />
            <CustomError error={globalError} />

            <CustomButton text={tradContent['registerBp'][language]} onPress={createAccount} />
            <CustomButton text={tradContent['cancelBp'][language]} onPress={cancel} />
          </form>
        ) : null}
      </div>
    </>
  );
}
