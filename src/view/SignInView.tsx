//Thomas Catonet
//VERSION 1.0
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

import '../style/App.css';
import '../style/message.css';

import CustomButton from '../components/button/CustomButton';
import CustomInput from '../components/input/CustomInput';
import CustomPasswordInput from '../components/input/CustomPasswordInput';
import CustomTitle from '../components/title/CustomTitle';
import CustomError from '../components/error/CustomError';
import tradContent from '../assets/traduction/dictionary';
import NavbarLogin from '../components/navbar/NavbarLogin';
import saveToken from '../components/sessionManager/saveToken';
import Axios from '../axios_config';
import Loader from '../components/loader/Loader';

import {
  SIGN_UP,
  FORGOT_PASSWORD,
  CONFIRMATION_EMAIL,
  PROJECT_LIST
} from '../components/navbar/Root';

export default function SignInView() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [globalError, setGlobalError] = React.useState('');
  const [language, setLanguage] = React.useState('');

  let navigate = useNavigate();

  const user = {
    email: email,
    password: password
  };

  useEffect(() => {
    extractToastMessage();
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  async function extractToastMessage() {
    var toast_success = await localStorage.getItem('toast_success');
    var toast_error = await localStorage.getItem('toast_error');
    if (toast_success !== '' && toast_success != null) {
      toast.success(toast_success);
      await localStorage.setItem('toast_success', '');
    } else {
      if (toast_error !== '' && toast_error != null) {
        toast.error(toast_error);
        await localStorage.setItem('toast_error', '');
      }
    }
  }

  function testSignInFormValue() {
    var error = false;

    setEmailError('');
    setPasswordError('');

    if (email === '') {
      setEmailError(tradContent['emailErrorNone'][language]);
      error = true;
    }

    if (password === '') {
      setPasswordError(tradContent['passwordErrorNone'][language]);
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

    return error;
  }

  function createAccountPage() {
    navigate(SIGN_UP);
  }
  function forgotPassword() {
    navigate(FORGOT_PASSWORD);
  }

  function signIn() {
    if (!testSignInFormValue()) {
      setShowLoader(true);
      Axios.post('/authenticate', user, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((res) => {
          const data = res.data;

          if (data['success']) {
            localStorage.setItem('accessCreateProject', data['accessCreateProject']);
            localStorage.setItem('accessUpdateProject', data['accessUpdateProject']);
            localStorage.setItem('accessDeleteProject', data['accessDeleteProject']);
            localStorage.setItem('accessSubscription', data['accessSubscription']);
            localStorage.setItem('accessUpdateAccount', data['accessUpdateAccount']);
            localStorage.setItem('accessSubAccount', data['accessSubAccount']);
            localStorage.setItem('subscription', data['subscription']);
            localStorage.setItem('token', data['refresh_token']);
            saveToken(data['refresh_token']);
            navigate(PROJECT_LIST);
            setShowLoader(false);
          } else {
            if (!data['validateAccount']) {
              navigate(CONFIRMATION_EMAIL);
            }
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
      <NavbarLogin />

      <div>
        <Toaster />
        {showLoader ? <Loader /> : null}
        {!showLoader ? (
          <form className="popup">
            <CustomTitle title={tradContent['loginTitle'][language]} />
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
            <CustomError error={globalError} />

            <CustomButton text={tradContent['signInBp'][language]} onPress={signIn} />
            <CustomButton text={tradContent['signUpBp'][language]} onPress={createAccountPage} />
            <CustomButton
              text={tradContent['forgotPasswordBp'][language]}
              onPress={forgotPassword}
            />
          </form>
        ) : null}
      </div>
    </>
  );
}
