//Thomas Catonet
//VERSION 1.0
import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

import '../style/popup.css';
import '../style/select_option.css';
import '../style/message.css';

import CustomButton from '../components/button/CustomButton';
import CustomInput from '../components/input/CustomInput';
import CustomTitle from '../components/title/CustomTitle';
import CustomError from '../components/error/CustomError';
import CustomLabel from '../components/label/CustomLabel';
import tradContent from '../assets/traduction/dictionary';
import NavbarContact from '../components/navbar/NavbarContact';
import Axios from '../axios_config';
import Loader from '../components/loader/Loader';
import { expressionEmail } from '../assets/regex/regex';

const styleTextarea = {
  fontSize: '2vh',
  border: '0.1vh solid #242424',
  borderRadius: '0vh'
};

const styleSelect = {
  fontSize: '2vh',
  height: '5vh',
  border: '0.1vh solid #242424'
};

export default function ContactView() {
  const [userEmail, setUserEmail] = React.useState('');
  const [subjectMessage, setSubjectMessage] = React.useState('');
  const [contentMessage, setContentMessage] = React.useState('');

  const [userEmailError, setUserEmailError] = React.useState('');
  const [contentMessageError, setContentMessageError] = React.useState('');

  const [showMessageSucessMail, setShowMessageSucessMail] = React.useState(false);

  const [messageSucessMail, setMessageSucessMail] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(false);
  const [language, setLanguage] = React.useState('');

  // payload de l'email à envoyer à l'api
  const message = {
    userEmail: userEmail,
    subjectMessage: subjectMessage,
    contentMessage: contentMessage
  };

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  function testContactForm() {
    var error = false;

    setUserEmailError('');
    setContentMessageError('');

    if (!expressionEmail.test(String(userEmail).toLowerCase())) {
      setUserEmailError(tradContent['emailErrorFormat'][language]);
      error = true;
    }

    if (userEmail === '') {
      setUserEmailError(tradContent['emailErrorNone'][language]);
      error = true;
    }

    if (contentMessage === '') {
      setContentMessageError(tradContent['contentMessageErrorNone'][language]);
      error = true;
    }

    if (userEmail.length > 100) {
      setUserEmailError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (contentMessage.length > 1000) {
      setContentMessageError(tradContent['longInputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  const handleChangeSubject = (event: any) => {
    setSubjectMessage(event.target.value);
  };

  const handleChangeContent = (event: any) => {
    setContentMessage(event.target.value);
  };

  function sendMessage() {
    setShowLoader(true);

    if (testContactForm()) {
      setShowLoader(false);
      return;
    }

    Axios.post('/contact/sendmail', message, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((res) => {
        setShowLoader(false);
        const data = res.data;

        if (data['success']) {
          setShowLoader(false);
          setShowMessageSucessMail(true);
          setMessageSucessMail(data['message']);
        } else {
          toast.error(tradContent['internalError'][language]);
        }
      })
      .catch(() => {
        setShowLoader(false);
        toast.error(tradContent['internalError'][language]);
      });
  }

  return (
    <>
      <NavbarContact />

      <div>
        <Toaster />
        {showLoader ? <Loader /> : null}

        {!showLoader ? (
          <form className="popup">
            <CustomTitle title={tradContent['contactTitle'][language]} />

            <CustomLabel value={tradContent['subjectLabel'][language]} />
            <select
              className="custom-select"
              style={styleSelect}
              value={subjectMessage}
              onChange={handleChangeSubject}>
              <option value="Bug">Bug</option>
              <option value="New feature">New feature</option>
              <option value="Other">Other</option>
            </select>
            <CustomError error={contentMessageError} />

            <CustomInput
              name={tradContent['emailLabel'][language]}
              type="userEmail"
              value={userEmail}
              onPress={(e) => setUserEmail(e.target.value)}
            />
            <CustomError error={userEmailError} />

            <CustomLabel value={tradContent['messageLabel'][language]} />
            <textarea
              style={styleTextarea}
              rows={10}
              className="form-control"
              value={contentMessage}
              onChange={handleChangeContent}
            />
            <CustomError error={contentMessageError} />

            <CustomButton text={tradContent['sendBp'][language]} onPress={sendMessage} />
          </form>
        ) : null}

        {showMessageSucessMail ? (
          <div className="sucess_sendmail popup">
            <label>{messageSucessMail}</label>
          </div>
        ) : null}
      </div>
    </>
  );
}
