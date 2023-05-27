//Thomas Catonet
//VERSION 1.0

import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import '../../../style/style.css';

import NavbarSubAccountAction from '../../../components/navbar/NavbarSubAccountAction';
import CustomPasswordInput from '../../../components/input/CustomPasswordInput';
import CustomButton from '../../../components/button/CustomButton';
import CustomInput from '../../../components/input/CustomInput';
import CustomTitle from '../../../components/title/CustomTitle';
import CustomError from '../../../components/error/CustomError';
import tradContent from '../../../assets/traduction/dictionary';
import Axios from '../../../axios_config';
import Loader from '../../../components/loader/Loader';
import saveToken from '../../../components/sessionManager/saveToken';
import getToken from '../../../components/sessionManager/getToken';
import { SIGN_IN, SUB_ACCOUNT } from '../../../components/navbar/Root';

function DeleteSubAccount(props: any) {
  const [deleteSentence, setDeleteSentence] = React.useState('');
  const [validationPassword, setValidationPassword] = React.useState('');
  const [validationPasswordError, setValidationPasswordError] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);

  const [globalDeleteError, setGlobalDeleteError] = React.useState('');
  const [deleteSentenceError, setDeleteSentenceError] = React.useState('');
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

    if (validationPassword === '') {
      setValidationPasswordError('Your password cannot be null');
      error = true;
    }

    if (deleteSentence !== 'Search and destroy') {
      setDeleteSentenceError("You must enter the sentence 'Search and destroy'");
      error = true;
    }

    if (validationPassword.length > 100) {
      setValidationPasswordError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  function deleteSubAccount() {
    if (!testDeleteProjectForm()) {
      setShowLoader(true);
      Axios.delete('/subAccount', {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'x-access-tokens': getToken()
        },
        data: {
          email: props.email
        }
      })
        .then((res) => {
          const data = res.data;
          setShowLoader(false);

          if (data['success']) {
            saveToken(data['refresh_token']);
            localStorage.setItem('toast_success', tradContent['subAccountDeleteMessage'][language]);
            navigate(SUB_ACCOUNT);
          } else {
            if (data['message'] === 'token is invalid') {
              localStorage.setItem('toast_error', tradContent['sessionTimeOutError'][language]);
              navigate(SIGN_IN);
            } else {
              toast.error('Error');
              setGlobalDeleteError(data['error']);
            }
          }
        })
        .catch(() => {
          setShowLoader(false);
          toast.error(tradContent['internalError'][language]);
        });
      return;
    }
  }

  return (
    <>
      <NavbarSubAccountAction />
      <div>
        {showLoader ? <Loader /> : null}
        {!showLoader ? (
          <form className="popup">
            <CustomTitle title={tradContent['deleteSubAccountTitle'][language]} />
            <CustomInput
              name={tradContent['sentenceVerificationDestroyLabel'][language]}
              type="deleteSentence"
              value={deleteSentence}
              onPress={(e) => setDeleteSentence(e.target.value)}
            />
            <CustomError error={deleteSentenceError} />

            <CustomPasswordInput
              placeholder={tradContent['passwordIn'][language]}
              password={validationPassword}
              onPress={(e) => setValidationPassword(e.target.value)}
            />

            <CustomError error={validationPasswordError} />
            <CustomError error={globalDeleteError} />
            <CustomButton text={tradContent['deleteBp'][language]} onPress={deleteSubAccount} />
          </form>
        ) : null}
      </div>
    </>
  );
}

export default DeleteSubAccount;
