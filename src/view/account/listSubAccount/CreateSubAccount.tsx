//Thomas Catonet
//VERSION 2.0

import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Cookies from 'universal-cookie';

import '../../../style/popup.css';
import '../../../style/general.css';
import '../../../style/pageProjectLogic.css';
import '../../../style/style.css';

import CustomLabel from '../../../components/label/CustomLabel';
import CustomButton from '../../../components/button/CustomButton';
import CustomInput from '../../../components/input/CustomInput';
import CustomPasswordInput from '../../../components/input/CustomPasswordInput';
import CustomTitle from '../../../components/title/CustomTitle';
import CustomError from '../../../components/error/CustomError';
import tradContent from '../../../assets/traduction/dictionary';
import Loader from '../../../components/loader/Loader';
import NavbarSubAccountAction from '../../../components/navbar/NavbarSubAccountAction';
import Axios from '../../../axios_config';
import saveToken from '../../../components/sessionManager/saveToken';
import getToken from '../../../components/sessionManager/getToken';
import { SIGN_IN, SUB_ACCOUNT } from '../../../components/navbar/Root';
import { expressionEmail, expressionPassword } from '../../../assets/regex/regex';

const checkStyle = {
  height: '4vh',
  width: '40vh'
};

const spaceBottomStyle = {
  marginBottom: '4vh'
};

function SubAccountCreate() {
  const [showLoader, setShowLoader] = React.useState(false);

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordBis, setPasswordBis] = React.useState('');

  const [usernameError, setUsernameError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [passwordBisError, setPasswordBisError] = React.useState('');

  const [accessCreateProject, setAccessCreateProject] = React.useState('');
  const [accessUpdateProject, setAccessUpdateProject] = React.useState('');
  const [accessDeleteProject, setAccessDeleteProject] = React.useState('');
  const [accessUpdateAccount, setAccessUpdateAccount] = React.useState('');
  const [globalError, setGlobalError] = React.useState('');

  const [language, setLanguage] = React.useState('');

  let navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  function reverseBooString(str: string) {
    if (str === 'true') {
      return 'false';
    } else {
      return 'true';
    }
  }

  function testCreateSubAccountForm() {
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

  function createSubAccount() {
    if (!testCreateSubAccountForm()) {
      setShowLoader(true);

      Axios.post('/subAccount', {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'x-access-tokens': getToken()
        },
        data: {
          email: email,
          name: username,
          password: password,
          accessCreateProject: accessCreateProject,
          accessUpdateProject: accessUpdateProject,
          accessDeleteProject: accessDeleteProject,
          accessUpdateAccount: accessUpdateAccount
        }
      })
        .then((res) => {
          const data = res.data;
          setShowLoader(false);

          if (data['success']) {
            saveToken(data['refresh_token']);
            localStorage.setItem('toast_success', tradContent['subAccountCreate'][language]);
            navigate(SUB_ACCOUNT);
          } else {
            if (data['message'] === 'token is invalid') {
              localStorage.setItem('toast_error', tradContent['sessionTimeOutError'][language]);
              navigate(SIGN_IN);
            } else {
              toast.error('Error');
              setGlobalError(data['error']);
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
      {showLoader ? <Loader /> : null}
      <Toaster />

      {!showLoader ? (
        <div>
          <form className="popup">
            <CustomTitle title={tradContent['createSubAccountTitle'][language]} />

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

            <CustomTitle title={tradContent['accessSubAccountTitle'][language]} />
            <RadioGroup aria-label="gender" name="gender1">
              <div style={checkStyle}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onClick={() => setAccessUpdateAccount(reverseBooString(accessUpdateAccount))}
                      classes={{ root: 'custom-checkbox-root' }}
                      color="default"
                    />
                  }
                  label={<CustomLabel value={tradContent['updateAccountLabel'][language]} />}
                />
              </div>
              <div style={checkStyle}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onClick={() => setAccessCreateProject(reverseBooString(accessCreateProject))}
                      classes={{ root: 'custom-checkbox-root' }}
                      color="default"
                    />
                  }
                  label={<CustomLabel value={tradContent['createProjectLabel'][language]} />}
                />
              </div>
              <div style={checkStyle}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onClick={() => setAccessUpdateProject(reverseBooString(accessUpdateProject))}
                      classes={{ root: 'custom-checkbox-root' }}
                      color="default"
                    />
                  }
                  label={<CustomLabel value={tradContent['updateProjectLabel'][language]} />}
                />
              </div>
              <div style={(checkStyle, spaceBottomStyle)}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onClick={() => setAccessDeleteProject(reverseBooString(accessDeleteProject))}
                      classes={{ root: 'custom-checkbox-root' }}
                      color="default"
                    />
                  }
                  label={<CustomLabel value={tradContent['deleteProjectLabel'][language]} />}
                />
              </div>
            </RadioGroup>
            <CustomError error={globalError} />

            <CustomButton text={tradContent['createBp'][language]} onPress={createSubAccount} />
          </form>
        </div>
      ) : null}
    </>
  );
}

export default SubAccountCreate;
