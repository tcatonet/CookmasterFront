//Thomas Catonet
//VERSION 1.0
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

import '../../style/popup.css';

import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';
import CustomPasswordInput from '../../components/input/CustomPasswordInput';
import CustomTitle from '../../components/title/CustomTitle';
import CustomError from '../../components/error/CustomError';
import tradContent from '../../assets/traduction/dictionary';
import Axios from '../../axios_config';
import Loader from '../../components/loader/Loader';
import NavbarAccountAction from '../../components/navbar/NavbarAccountAction';
import saveToken from '../../components/sessionManager/saveToken';
import getToken from '../../components/sessionManager/getToken';
import { SIGN_IN, ACCOUNT, ACCOUNT_CONFIRMATION_UPDATE } from '../../components/navbar/Root';
import { expressionEmail, expressionPassword } from '../../assets/regex/regex';

export default function UpdateAccountView() {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordBis, setPasswordBis] = React.useState('');
  const [validationUserPassword, setValidationUserPassword] = React.useState('');

  const [emailError, setEmailError] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [passwordBisError, setPasswordBisError] = React.useState('');
  const [validationUserPasswordError, setValidationUserPasswordError] = React.useState('');
  const [globalError, setGlobalError] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [language, setLanguage] = React.useState('');

  let navigate = useNavigate();

  const infoUpdate = {
    email: email,
    name: name,
    passwordBis: passwordBis,
    password: validationUserPassword,
    validationUserPassword: validationUserPassword
  };

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  function testUpdateForm() {
    var error = false;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setPasswordBisError('');
    setValidationUserPasswordError('');

    if (!expressionEmail.test(String(email).toLowerCase()) && email !== '') {
      setEmailError(tradContent['emailErrorFormat'][language]);
      error = true;
    }

    if (!expressionPassword.test(String(password)) && password !== '') {
      setPasswordBisError(tradContent['passwordErrorFormat'][language]);
      error = true;
    }

    if (passwordBis !== password) {
      setPasswordBisError(tradContent['passwordBisErrorNotEqual'][language]);
      error = true;
    }

    if (validationUserPassword === '') {
      setValidationUserPasswordError(tradContent['currentPasswordErrorNone'][language]);
      error = true;
    }

    if (email.length > 100) {
      setEmailError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (name.length > 100) {
      setNameError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (passwordBis.length > 100) {
      setPasswordBisError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (password.length > 100) {
      setPasswordError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  function updateAccountInfo() {
    if (!testUpdateForm()) {
      setShowLoader(true);

      Axios.patch('/account', infoUpdate, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'x-access-tokens': getToken()
        }
      })
        .then((res) => {
          const data = res.data;
          setShowLoader(false);

          if (data['success']) {
            if (email !== '') {
              saveToken(data['refresh_token']);
              navigate(ACCOUNT_CONFIRMATION_UPDATE);
            } else {
              saveToken(data['refresh_token']);
              localStorage.setItem('toast_success', tradContent['accountUpdateMessage'][language]);
              navigate(ACCOUNT);
            }
          } else {
            if (data['message'] === 'token is invalid') {
              localStorage.setItem('toast_error', tradContent['sessionTimeOutError'][language]);
              navigate(SIGN_IN);
            } else {
              localStorage.setItem('toast_error', 'Error');
              setGlobalError(data['error']);
            }
          }
        })
        .catch((e) => {
          console.log(e);
          setShowLoader(false);
          localStorage.setItem('toast_error', toast.error(tradContent['internalError'][language]));
        });
    }
  }

  return (
    <>
      <NavbarAccountAction />
      <div>
        {showLoader ? <Loader /> : null}
        <Toaster />
        <form className="popup">
          <CustomTitle title={tradContent['updateAccountTitle'][language]} />

          <CustomInput
            name={tradContent['emailLabel'][language]}
            type="email"
            defaultValue={email}
            onPress={(e) => setEmail(e.target.value)}
          />
          <CustomError error={emailError} />

          <CustomInput
            name={tradContent['nameLabel'][language]}
            type="name"
            defaultValue={name}
            onPress={(e) => setName(e.target.value)}
          />
          <CustomError error={nameError} />

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

          <CustomPasswordInput
            placeholder={tradContent['currentPasswordIn'][language]}
            password={validationUserPassword}
            onPress={(e) => setValidationUserPassword(e.target.value)}
          />
          <CustomError error={validationUserPasswordError} />

          <CustomButton text={tradContent['updateBp'][language]} onPress={updateAccountInfo} />
        </form>
      </div>
    </>
  );
}
