//Thomas Catonet
//VERSION 1.0
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

import '../../style/style.css';
import Axios from '../../axios_config';
import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';
import CustomTitle from '../../components/title/CustomTitle';
import CustomError from '../../components/error/CustomError';
import tradContent from '../../assets/traduction/dictionary';
import getToken from '../../components/sessionManager/getToken';
import saveToken from '../../components/sessionManager/saveToken';
import Loader from '../../components/loader/Loader';
import NavbarUpdateAccountAction from '../../components/navbar/NavbarUpdateAccountAction';
import { SIGN_IN, ACCOUNT } from '../../components/navbar/Root';

export default function UpdateAccountConfirmationView() {
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

  const codePayload = {
    code: code
  };

  function confirmCode() {
    setShowLoader(true);
    if (testCodeFormValue()) {
      setShowLoader(false);
      return;
    }
    console.log(codePayload);

    Axios.post('/codeConfirmation', {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'x-access-tokens': getToken()
      }
    })
      .then(async (res) => {
        const data = res.data;
        setShowLoader(false);

        if (data['success']) {
          saveToken(data['refresh_token']);
          setShowLoader(false);
          localStorage.setItem('toast_success', tradContent['createAccountMessage'][language]);
          navigate(ACCOUNT);
        } else {
          if (data['message'] === 'token is invalid') {
            setShowLoader(false);
            localStorage.setItem('toast_error', tradContent['sessionTimeOutError'][language]);
            navigate(SIGN_IN);
          } else {
            setShowLoader(false);
            setGlobalError(data['error']);
          }
        }
      })
      .catch(() => {
        setShowLoader(false);
        toast.error(tradContent['internalError'][language]);
      });
  }

  return (
    <>
      <NavbarUpdateAccountAction />
      <Toaster />
      <div>
        {showLoader ? <Loader /> : null}
        {!showLoader ? (
          <form className="popup">
            <CustomTitle title={tradContent['confirmAccountTitle'][language]} />

            <CustomInput
              name={tradContent['codeLabel'][language]}
              type="code"
              value={code}
              onPress={(e) => setCode(e.target.value)}
            />
            <CustomError error={codeError} />
            <CustomError error={globalError} />

            <CustomButton text={tradContent['confirmBp'][language]} onPress={confirmCode} />
          </form>
        ) : null}
      </div>
    </>
  );
}
