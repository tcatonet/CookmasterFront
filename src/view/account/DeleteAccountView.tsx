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
import { SIGN_IN } from '../../components/navbar/Root';

export default function DeleteAccountView() {
  const [deleteSentence, setDeleteSentence] = React.useState('');
  const [validationPassword, setValidationPassword] = React.useState('');
  const [deleteSentenceError, setDeleteSentenceError] = React.useState('');
  const [validationPasswordError, setValidationPasswordError] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [globalError, setGlobalError] = React.useState('');
  const [language, setLanguage] = React.useState('');

  let navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  function testDeleteProjectForm() {
    var error = false;
    setValidationPasswordError('');
    setDeleteSentenceError('');

    if (validationPassword === '') {
      setValidationPasswordError(tradContent['passwordErrorNone'][language]);
      error = true;
    }

    if (deleteSentence !== 'Search and destroy') {
      setDeleteSentenceError(tradContent['deleteProjectSentenceError'][language]);
      error = true;
    }

    if (validationPassword.length > 100) {
      setValidationPasswordError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  function deleteAccount() {
    if (testDeleteProjectForm()) {
      return;
    }
    setShowLoader(true);

    Axios.delete('/account', {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'x-access-tokens': getToken()
      },
      data: {
        name: localStorage.getItem('currentProject')
      }
    })
      .then((res) => {
        const data = res.data;
        setShowLoader(false);

        if (data['success']) {
          saveToken(data['refresh_token']);
          localStorage.setItem('toast_success', tradContent['accountDeleteMessage'][language]);
          localStorage.setItem('currentProject', '');
          navigate(SIGN_IN);
        } else {
          if (data['error'] === 'token is invalid') {
            localStorage.setItem('toast_error', tradContent['sessionTimeOutError'][language]);
            navigate(SIGN_IN);
          } else {
            localStorage.setItem('toast_error', 'Error');
            setGlobalError(data['error']);
          }
        }
      })
      .catch(() => {
        setShowLoader(false);
        localStorage.setItem('toast_error', toast.error(tradContent['internalError'][language]));
      });
  }

  return (
    <>
      <NavbarAccountAction />
      <div>
        {showLoader ? <Loader /> : null}
        <Toaster />
        <form className="popup">
          <CustomTitle title={tradContent['deleteAccountTitle'][language]} />

          <CustomInput
            name={tradContent['sentenceVerificationDestroyLabel'][language]}
            type="text"
            value={deleteSentence}
            onPress={(e) => setDeleteSentence(e.target.value)}
          />
          <CustomError error={deleteSentenceError} />

          <CustomPasswordInput
            placeholder={tradContent['passwordLabel'][language]}
            password={validationPassword}
            onPress={(e) => setValidationPassword(e.target.value)}
          />
          <CustomError error={validationPasswordError} />
          <CustomError error={globalError} />

          <CustomButton text={tradContent['deleteBp'][language]} onPress={deleteAccount} />
        </form>
      </div>
    </>
  );
}
