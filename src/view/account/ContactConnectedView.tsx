//Thomas Catonet
//VERSION 2.0
import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

import '../../style/popup.css';
import '../../style/select_option.css';
import '../../style/message.css';

import CustomButton from '../../components/button/CustomButton';
import CustomTitle from '../../components/title/CustomTitle';
import CustomError from '../../components/error/CustomError';
import CustomLabel from '../../components/label/CustomLabel';
import tradContent from '../../assets/traduction/dictionary';
import NavbarContactConnected from '../../components/navbar/NavbarContactConnected';
import Axios from '../../axios_config';
import Loader from '../../components/loader/Loader';

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

export default function ContactConnectedView() {
  const [subjectMessage, setSubjectMessage] = React.useState('');
  const [contentMessage, setContentMessage] = React.useState('');

  const [contentMessageError, setContentMessageError] = React.useState('');
  const [userSubjectError, setUserSubjectError] = React.useState('');

  const [showMessageErrorMail, setShowMessageErrorMail] = React.useState(false);
  const [showMessageSucessMail, setShowMessageSucessMail] = React.useState(false);
  const [showFormMail, setSowFormMail] = React.useState(true);

  const [messageErrorMail, setMessageErrorMail] = React.useState(false);
  const [messageSucessMail, setMessageSucessMail] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(false);
  const [showMessageInternalErrorMail, setShowMessageInternalErrorMail] = React.useState(false);
  const [language, setLanguage] = React.useState('');

  const message = {
    userEmail: 'catonethoma@yahoo.frs',
    subjectMessage: subjectMessage,
    contentMessage: contentMessage
  };

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  const handleChangeSubject = (event: any) => {
    setSubjectMessage(event.target.value);
  };

  const handleChangeContent = (event: any) => {
    setContentMessage(event.target.value);
  };

  function testContactForm() {
    var error = false;

    setContentMessageError('');

    if (contentMessage === '') {
      setContentMessageError(tradContent['contentMessageErrorNone'][language]);
      error = true;
    }

    if (contentMessage.length > 1000) {
      setContentMessageError(tradContent['longInputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  function sendMessage() {
    setShowLoader(true);
    setSowFormMail(false);

    if (testContactForm()) {
      setShowLoader(false);
      setSowFormMail(true);
      return;
    }

    Axios.post('/contact/sendmail', message, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((res) => {
        setContentMessageError('');
        setUserSubjectError('');
        const data = res.data;
        setShowLoader(false);

        if (data['success']) {
          setShowMessageSucessMail(true);
          setShowMessageErrorMail(false);
          setMessageSucessMail(data['message']);
        } else {
          setContentMessageError(data['message']['field']['contentMessage']);
          setUserSubjectError(data['message']['field']['subjectMessage']);
          setMessageErrorMail(data['message']);

          setShowMessageSucessMail(false);
          setShowMessageErrorMail(false);
          setSowFormMail(true);

          if (
            !(
              data['message']['field']['contentMessage'] ||
              data['message']['field']['subjectMessage'] ||
              data['message']['field']['userEmail']
            )
          ) {
            setShowMessageErrorMail(true);
            setSowFormMail(false);
            setMessageErrorMail(data['message']);
          }
        }
      })
      .catch(() => {
        setShowMessageInternalErrorMail(true);
        setShowLoader(false);
        toast.error(tradContent['internalError'][language]);
      });
  }

  return (
    <>
      <NavbarContactConnected />
      <div>
        <Toaster />

        {showLoader ? <Loader /> : null}
        {showFormMail ? (
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
            <CustomError error={userSubjectError} />

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

        {showMessageInternalErrorMail ? (
          <div className="error_sendmail popup">
            <CustomLabel value={tradContent['internalError'][language]} />
          </div>
        ) : null}

        {showMessageErrorMail ? (
          <div className="error_sendmail popup">
            <CustomLabel value={messageErrorMail} />
          </div>
        ) : null}

        {showMessageSucessMail ? (
          <div className="sucess_sendmail popup">
            <CustomLabel value={messageSucessMail} />
          </div>
        ) : null}
      </div>
    </>
  );
}
