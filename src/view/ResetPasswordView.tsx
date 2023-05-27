//Thomas Catonet
//VERSION 1.0
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

import '../style/style.css';

import Axios from '../axios_config';
import CustomButton from '../components/button/CustomButton';
import CustomPasswordInput from '../components/input/CustomPasswordInput';
import CustomTitle from '../components/title/CustomTitle';
import CustomError from '../components/error/CustomError';
import tradContent from '../assets/traduction/dictionary';
import Loader from '../components/loader/Loader';
import NavbarLogin from '../components/navbar/NavbarLogin';
import { FORGOT_PASSWORD_RESET_CONFIRMATION, SIGN_IN } from '../components/navbar/Root';
import { expressionPassword } from '../assets/regex/regex';

export default function ResetPasswordView() {
  const [password, setPassword] = React.useState('');
  const [passwordBis, setPasswordBis] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [passwordBisError, setPasswordBisError] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [language, setLanguage] = React.useState('');
  const [globalError, setGlobalError] = React.useState('');

  let navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  function testResetPasswordForm() {
    var error = false;
    setPasswordError('');
    setPasswordBisError('');

    if (!expressionPassword.test(String(password))) {
      setPasswordBisError(tradContent['passwordErrorFormat'][language]);
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

  function cancel() {
    navigate(FORGOT_PASSWORD_RESET_CONFIRMATION);
  }

  const passwordPayload = {
    password: password
  };

  function resetPassword() {
    setShowLoader(true);
    if (testResetPasswordForm()) {
      setShowLoader(false);
      return;
    }

    Axios.post('/resetPassword', passwordPayload, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(async (res) => {
        const data = res.data;
        if (data['success']) {
          setShowLoader(false);
          localStorage.setItem('toast_success', tradContent['resetPasswordMessage'][language]);
          navigate(SIGN_IN);
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

  return (
    <>
      <NavbarLogin />
      <Toaster />
      <div>
        {showLoader ? <Loader /> : null}
        {!showLoader ? (
          <form className="popup">
            <CustomTitle title={tradContent['resetPasswordTitle'][language]} />

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

            <CustomButton text={tradContent['confirmBp'][language]} onPress={resetPassword} />
            <CustomButton text={tradContent['cancelBp'][language]} onPress={cancel} />
          </form>
        ) : null}
      </div>
    </>
  );
}
