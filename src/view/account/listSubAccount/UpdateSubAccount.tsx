//Thomas Catonet
//VERSION 1.0

import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import '../../../style/style.css';

import NavbarSubAccountAction from '../../../components/navbar/NavbarSubAccountAction';
import CustomPasswordInput from '../../../components/input/CustomPasswordInput';
import CustomButton from '../../../components/button/CustomButton';
import CustomLabel from '../../../components/label/CustomLabel';
import CustomInput from '../../../components/input/CustomInput';
import CustomTitle from '../../../components/title/CustomTitle';
import CustomError from '../../../components/error/CustomError';
import tradContent from '../../../assets/traduction/dictionary';
import Axios from '../../../axios_config';
import Loader from '../../../components/loader/Loader';
import saveToken from '../../../components/sessionManager/saveToken';
import getToken from '../../../components/sessionManager/getToken';
import { SIGN_IN, SUB_ACCOUNT } from '../../../components/navbar/Root';
import { expressionEmail, expressionPassword } from '../../../assets/regex/regex';

const checkStyle = {
  height: '4vh',
  width: '30vh'
};

const spaceBottomStyle = {
  marginBottom: '4vh'
};

function UpdateSubAccount() {
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
  const [showLoader, setShowLoader] = React.useState(false);

  const [accessCreateProject, setAccessCreateProject] = React.useState('');
  const [accessUpdateProject, setAccessUpdateProject] = React.useState('');
  const [accessDeleteProject, setAccessDeleteProject] = React.useState('');
  const [accessUpdateAccount, setAccessUpdateAccount] = React.useState('');
  const [globalUpdateError, setGlobalUpdateError] = React.useState('');

  const [language, setLanguage] = React.useState('');

  let navigate = useNavigate();

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
      setEmailError('You must use an email with a valid format');
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

    if (name.length > 100) {
      setNameError(tradContent['inputErrorToLong'][language]);
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

    if (validationUserPassword.length > 100) {
      setValidationUserPasswordError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  function reverseBooString(str: string) {
    if (str === 'true') {
      return 'false';
    } else {
      return 'true';
    }
  }

  function updateSubAccount() {
    if (!testUpdateForm()) {
      setShowLoader(true);
      Axios.patch('/subAccount', {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'x-access-tokens': getToken()
        },
        data: {
          email: email,
          name: name,
          newPassword: password,
          validationPassword: validationUserPassword,
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
            localStorage.setItem('toast_success', tradContent['subAccountUpdateMessage'][language]);
            localStorage.setItem('toast_error', '');
            console.log(tradContent['subAccountUpdateMessage'][language]);
            navigate(SUB_ACCOUNT);
          } else {
            if (data['message'] === 'token is invalid') {
              localStorage.setItem('toast_error', tradContent['sessionTimeOutError'][language]);
              navigate(SIGN_IN);
            } else {
              toast.error('Error');
              setGlobalUpdateError(data['error']);
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
      <div>
        <form className="popup">
          <CustomTitle title={tradContent['updateSubAccountTitle'][language]} />

          <CustomInput
            name={tradContent['emailLabel'][language]}
            type="email"
            value={email}
            onPress={(e) => setEmail(e.target.value)}
          />
          <CustomError error={emailError} />

          <CustomInput
            name={tradContent['nameLabel'][language]}
            type="name"
            value={name}
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

          <CustomPasswordInput
            placeholder={tradContent['currentPasswordIn'][language]}
            password={validationUserPassword}
            onPress={(e) => setValidationUserPassword(e.target.value)}
          />
          <CustomError error={validationUserPasswordError} />
          <CustomTitle title={tradContent['accessSubAccountTitle'][language]} />
          <RadioGroup aria-label="gender" name="gender1">
            <div style={checkStyle}>
              <FormControlLabel
                control={
                  <Checkbox
                    onClick={() => setAccessUpdateAccount(reverseBooString(accessUpdateAccount))}
                    color="default"
                    classes={{ root: 'custom-checkbox-root' }}
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
                    style={{ pointerEvents: 'auto' }}
                    color="default"
                    classes={{ root: 'custom-checkbox-root' }}
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
                    style={{ pointerEvents: 'auto' }}
                    color="default"
                    classes={{ root: 'custom-checkbox-root' }}
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
                    style={{ pointerEvents: 'auto' }}
                    color="default"
                    classes={{ root: 'custom-checkbox-root' }}
                  />
                }
                label={<CustomLabel value={tradContent['deleteProjectLabel'][language]} />}
              />
            </div>
          </RadioGroup>
          <CustomError error={globalUpdateError} />
          <CustomButton text={tradContent['updateBp'][language]} onPress={updateSubAccount} />
        </form>
      </div>
    </>
  );
}

export default UpdateSubAccount;
