//Thomas Catonet
//VERSION 1.0
import React, { useEffect, ReactNode, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';
import { StepMachine, StepContainer, Step } from 'react-step-machine';

import '../style/App.css';
import '../style/message.css';
import './modal.css';

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
  HOME
} from '../components/navbar/Root';

export default function SignInView() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [globalError, setGlobalError] = React.useState('');
  const [language, setLanguage] = React.useState('');
  const { isOpen, toggle } = useModal();
  
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


  function signIn() {
    if (!testSignInFormValue()) {
      setShowLoader(true);
      Axios.post('/login', user, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((res) => {
          const data = res.data;
          console.log(data)
          if (res.status==200) {
            console.log(data)
            
            if (data['level']==5){
              navigate(CONFIRMATION_EMAIL);
            }else{
              localStorage.setItem('level', data['level']);
              saveToken(data['token']);
              navigate(HOME);
              setShowLoader(false);
            }
            
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
              onPress={toggle}
            />
          </form>
        ) : null}


      </div>
      <Modal isOpen={isOpen} toggle={toggle}></Modal>


    </>
  );
}



interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export function Modal(props: ModalType) {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [globalError, setGlobalError] = React.useState('');
  const [language, setLanguage] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);

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

  let navigate = useNavigate();
  
  const user_email = {
    email: email,
  };


  function sendEmailForm() {


      setShowLoader(true);
      Axios.post('/password/retrieve', user_email, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((res) => {
          const data = res.data;
          console.log(data)
          if (res.status==200) {
            
            if (data['level']==5){
              navigate(CONFIRMATION_EMAIL);
            }else{
              toast.success(tradContent['emailSend'][language]);
              setShowLoader(false);
            }
            
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
      {props.isOpen && (
        <div className= 'modal-overlay' onClick={props.toggle}>
          <form onClick={(e) => e.stopPropagation()} className="modal-box">
            {props.children}
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
            <CustomButton text={tradContent['cancelBp'][language]} onPress={props.toggle} />
          </form>
        </div>
      )}
    </>
  );
}



export function useModal() {
  const [isOpen, setisOpen] = useState(false);

  const toggle = () => {
    setisOpen(!isOpen);
  };

  return {
    isOpen,
    toggle
  };
}
