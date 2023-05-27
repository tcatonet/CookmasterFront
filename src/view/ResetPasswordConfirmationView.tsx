//Thomas Catonet
//VERSION 1.0
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/style.css';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

import Axios from '../axios_config';
import CustomButton from '../components/button/CustomButton';
import CustomInput from '../components/input/CustomInput';
import CustomTitle from '../components/title/CustomTitle';
import CustomError from '../components/error/CustomError';
import tradContent from '../assets/traduction/dictionary';
import Loader from '../components/loader/Loader';
import NavbarLogin from '../components/navbar/NavbarLogin';
import { FORGOT_PASSWORD, FORGOT_PASSWORD_RESET } from '../components/navbar/Root';

export default function ResetPasswordConfirmationView() {
  const [code, setCode] = React.useState('');
  const [codeError, setCodeError] = React.useState('');
  const [language, setLanguage] = React.useState('');
  const [globalError, setGlobalError] = React.useState('');

  const [showLoader, setShowLoader] = React.useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  function testCodeFormValue() {
    var error = false;
    setCodeError('');

    if (code === '') {
      setCodeError(tradContent['codeErrorNone'][language]);
      error = true;
    }

    if (code.length > 100) {
      setCodeError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  function cancel() {
    navigate(FORGOT_PASSWORD);
  }

  const codePayload = {
    code: code
  };

  function resetPassword() {
    setShowLoader(true);
    if (testCodeFormValue()) {
      setShowLoader(false);
      return;
    }

    Axios.post('/codeResetPassword', codePayload, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(async (res) => {
        const data = res.data;
        if (data['success']) {
          setShowLoader(false);
          navigate(FORGOT_PASSWORD_RESET);
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
            <CustomTitle title={tradContent['confirmEmailTitle'][language]} />

            <CustomInput
              name={tradContent['codeLabel'][language]}
              type="code"
              value={code}
              onPress={(e) => setCode(e.target.value)}
            />
            <CustomError error={codeError} />
            <CustomError error={globalError} />

            <CustomButton text={tradContent['confirmBp'][language]} onPress={resetPassword} />
            <CustomButton text={tradContent['cancelBp'][language]} onPress={cancel} />
          </form>
        ) : null}
      </div>
    </>
  );
}
