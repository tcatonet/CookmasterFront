//Thomas Catonet
//VERSION 2.0

import React, { useEffect } from 'react';
import { Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import '../../../style/popup.css';
import '../../../style/general.css';
import '../../../style/pageProjectLogic.css';
import '../../../style/style.css';
import './subAccount.css';

import CustomError from '../../../components/error/CustomError';
import CustomCenterButton from '../../../components/button/CustomCenterButton';
import CustomTitle from '../../../components/title/CustomTitle';
import tradContent from '../../../assets/traduction/dictionary';
import Loader from '../../../components/loader/Loader';
import SubAccountCard from './SubAccountCard';
import NavbarAccountAction from '../../../components/navbar/NavbarAccountAction';
import Axios from '../../../axios_config';
import getToken from '../../../components/sessionManager/getToken';
import { SIGN_IN, SUB_ACCOUNT_CREATE } from '../../../components/navbar/Root';

function SubAccountListView() {
  const [subAccountsFilter, setSubAccountFilter] = React.useState([]);
  const [showLoader, setShowLoader] = React.useState(false);
  const [globalError, setGlobalError] = React.useState('');
  const [language, setLanguage] = React.useState('');
  let navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);

    Axios.get('/subAccounts', {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'x-access-tokens': getToken()
      }
    })
      .then((res) => {
        const data = res.data;
        setShowLoader(false);

        if (data['success']) {
          setSubAccountFilter(data['subAccount']);
          var toast_success = localStorage.getItem('toast_success');
          var toast_error = localStorage.getItem('toast_error');

          if (toast_success !== '' && toast_success !== undefined) {
            toast.success(toast_success);
            localStorage.setItem('toast_success', '');
          }

          if (toast_error !== '' && toast_error !== undefined) {
            toast.error(toast_error);
            localStorage.setItem('toast_error', '');
          }
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
        toast.error(tradContent['internalError'][language]);
      });
  },[setLanguage, language, navigate]);

  function create() {
    navigate(SUB_ACCOUNT_CREATE);
  }

  return (
    <>
      <NavbarAccountAction />
      {showLoader ? <Loader /> : null}
      <Toaster />

      {!showLoader ? (
        <div className="subAccount">
          <CustomTitle title={tradContent['subAccountTitle'][language]} />

          <Row>
            {subAccountsFilter?.length === 0 && subAccountsFilter && (
              <div className="notFound">{tradContent['noSunAccountFound'][language]}</div>
            )}

            {subAccountsFilter &&
              subAccountsFilter?.length > 0 &&
              subAccountsFilter?.map((subAccountFilter) => {
                return (
                  <SubAccountCard
                    key={subAccountFilter['email']}
                    email={subAccountFilter['email']}
                    name={subAccountFilter['name']}
                    access={subAccountFilter['access']}
                  />
                );
              })}
          </Row>
          <CustomError error={globalError} />
          <CustomCenterButton text={tradContent['createBp'][language]} onPress={create} />
        </div>
      ) : null}
    </>
  );
}

export default SubAccountListView;
