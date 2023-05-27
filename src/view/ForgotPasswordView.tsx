//Thomas Catonet
//VERSION 1.0
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

import '../style/style.css';

import Loader from '../components/loader/Loader';
import NavbarLogin from '../components/navbar/NavbarLogin';
import Axios from '../axios_config';
import CustomButton from '../components/button/CustomButton';
import CustomInput from '../components/input/CustomInput';
import CustomTitle from '../components/title/CustomTitle';
import CustomError from '../components/error/CustomError';
import tradContent from '../assets/traduction/dictionary';

import { FORGOT_PASSWORD_RESET_CONFIRMATION, SIGN_IN } from '../components/navbar/Root';

export default function ForgotPasswordView() {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [globalError, setGlobalError] = React.useState('');
  const [language, setLanguage] = React.useState('');

  let navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  const emailPayload = {
    email: email
  };

  function testSendEmailForm() {
    var error = false;
    setEmailError('');

    if (email === '') {
      setEmailError(tradContent['emailErrorNone'][language]);
      error = true;
    }

    if (email.length > 100) {
      setEmailError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  function sendEmailForm() {
    setShowLoader(true);
    if (testSendEmailForm()) {
      setShowLoader(false);
      return;
    }

    Axios.get('/codeResetPassword', emailPayload, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(async (res) => {
        const data = res.data;
        if (data['success']) {
          setShowLoader(false);
          navigate(FORGOT_PASSWORD_RESET_CONFIRMATION);
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

  function cancel() {
    navigate(SIGN_IN);
  }

  return (
    <>
      <NavbarLogin />
      <Toaster />

      <div>
        {showLoader ? <Loader /> : null}
        {!showLoader ? (
          <form className="popup">
            <CustomTitle title={tradContent['resetPasswdTitle'][language]} />

            <CustomInput
              name={tradContent['emailLabel'][language]}
              type="email"
              value={email}
              onPress={(e) => setEmail(e.target.value)}
            />
            <CustomError error={emailError} />
            <CustomError error={globalError} />

            <CustomButton text={tradContent['sendBp'][language]} onPress={sendEmailForm} />
            <CustomButton text={tradContent['cancelBp'][language]} onPress={cancel} />
          </form>
        ) : null}
      </div>
    </>
  );
}
