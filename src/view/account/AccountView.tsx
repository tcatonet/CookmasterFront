//Thomas Catonet
//VERSION 2.0

import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import '../../style/App.css';
import '../../style/message.css';
import './account.css';

import CustomButtonBox from '../../components/button/CustomButtonBox';
import CustomTitle from '../../components/title/CustomTitle';
import CustomLabel from '../../components/label/CustomLabel';
import tradContent from '../../assets/traduction/dictionary';
import Axios from '../../axios_config';
import Loader from '../../components/loader/Loader';
import NavbarAccount from '../../components/navbar/NavbarAccount';
import saveToken from '../../components/sessionManager/saveToken';
import getToken from '../../components/sessionManager/getToken';
import {
  SIGN_IN,
  SUBSCRIBE,
  ACCOUNT_UPDATE,
  ACCOUNT_DELETE,
  INVOICE_LIST,
  SUB_ACCOUNT
} from '../../components/navbar/Root';

const styleButton = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: '5vh'
};

export default function AccountView() {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(true);
  const [accessUpdateAccount] = React.useState(localStorage.getItem('accessUpdateAccount'));
  const [accessSubscription] = React.useState(localStorage.getItem('accessSubscription'));
  const [subscription] = React.useState(localStorage.getItem('subscription'));
  const [accessSubAccount] = React.useState(localStorage.getItem('accessSubAccount'));
  const [language, setLanguage] = React.useState('');

  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const cookies = new Cookies();
      const languageCookie = cookies.get('language');
      setLanguage(languageCookie);

      extractToastMessage();
      setShowLoader(true);
      Axios.get('/account', {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'x-access-tokens': getToken()
        }
      })
        .then((res) => {
          const data = res.data;
          if (data['success']) {
            saveToken(data['refresh_token']);
            setName(data['user']['name']);
            setEmail(data['user']['email']);
            setShowLoader(false);
          } else {
            if (data['error'] === 'token is invalid') {
              localStorage.setItem('toast_error', tradContent['sessionTimeOutError'][language]);
              navigate(SIGN_IN);
            }
            toast.error('Internal error try later');
          }
        })
        .catch(() => {
          setShowLoader(false);
          toast.error(tradContent['internalError'][language]);
        });
    })();
  },[setLanguage, language, navigate]);

  async function extractToastMessage() {
    var toast_success = await localStorage.getItem('toast_success');
    var toast_error = await localStorage.getItem('toast_error');
    if (toast_success !== '' && toast_success !== null) {
      toast.success(toast_success);
      await localStorage.setItem('toast_success', '');
    } else {
      if (toast_error !== '' && toast_error !== null) {
        toast.error(toast_error);
        await localStorage.setItem('toast_error', '');
      }
    }
  }

  function subscribe() {
    navigate(SUBSCRIBE);
  }

  function updateAccount() {
    navigate(ACCOUNT_UPDATE);
  }

  function deleteAccount() {
    navigate(ACCOUNT_DELETE);
  }

  function invoice() {
    navigate(INVOICE_LIST);
  }

  function subAccount() {
    navigate(SUB_ACCOUNT);
  }
  async function cancelSubscription() {
    try {
      const response = await fetchCancelSubscription();
      if (response['status'] !== 200) {
        alert(`Unable to cancel the subscription, try later`);
        setShowLoader(false);
      } else {
        alert('Subscription successful cancel');
        setShowLoader(false);
      }
    } catch (e) {
      setShowLoader(false);
    }
  }

  async function fetchCancelSubscription() {
    setShowLoader(true);
    const responseFetch = fetch(`http://0.0.0.0:4000/cancel-subscription`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscriptionId: 'sub_1LgwmxFcX5N52aWTWwcpqF4s'
      })
    });

    const response = await responseFetch;
    console.log(response);
    return response;
  }

  return (
    <div className="body">
      <NavbarAccount />
      <div>
        {showLoader ? <Loader /> : null}
        <Toaster />
        {!showLoader ? (
          <div className="account">
            <CustomTitle title={tradContent['accountTitle'][language]} />

            <CustomLabel value={tradContent['emailLabel'][language] + ': ' + email} />
            <CustomLabel value={tradContent['nameLabel'][language] + ': ' + name} />
            <div style={styleButton}>
              {accessUpdateAccount === 'true' ? (
                <>
                  <CustomButtonBox
                    text={tradContent['updateBp'][language]}
                    onPress={updateAccount}
                  />
                  <CustomButtonBox
                    text={tradContent['deleteBp'][language]}
                    onPress={deleteAccount}
                  />
                </>
              ) : null}
              {accessSubscription === 'true' ? (
                <>
                  <CustomButtonBox text={tradContent['invoiceBp'][language]} onPress={invoice} />
                  {subscription === 'false' ? (
                    <CustomButtonBox
                      text={tradContent['subscribeBp'][language]}
                      onPress={subscribe}
                    />
                  ) : null}
                  {subscription === 'true' ? (
                    <CustomButtonBox
                      text={tradContent['subscribeCancelBp'][language]}
                      onPress={cancelSubscription}
                    />
                  ) : null}
                  {accessSubAccount === 'true' ? (
                    <CustomButtonBox
                      text={tradContent['subAccountBp'][language]}
                      onPress={subAccount}
                    />
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

//npm i bootstrap-3-card
