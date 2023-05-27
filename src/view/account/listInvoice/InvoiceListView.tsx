//Thomas Catonet
//VERSION 1.0

import React, { useEffect } from 'react';
import { Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import '../../../style/popup.css';
import '../../../style/general.css';
import '../../../style/pageProjectLogic.css';
import '../../../style/style.css';
import './invoice.css';

import Loader from '../../../components/loader/Loader';
import InvoiceCard from './InvoiceCard';
import Axios from '../../../axios_config';
import NavbarAccountAction from '../../../components/navbar/NavbarAccountAction';
import saveToken from '../../../components/sessionManager/saveToken';
import getToken from '../../../components/sessionManager/getToken';
import { SIGN_IN } from '../../../components/navbar/Root';
import CustomTitle from '../../../components/title/CustomTitle';
import tradContent from '../../../assets/traduction/dictionary';

function InvoiceListView() {
  const [invoicesFilter, setInvoicesFilter] = React.useState([]);
  const [showLoader, setShowLoader] = React.useState(false);
  const [language, setLanguage] = React.useState('');
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setShowLoader(true);

      const cookies = new Cookies();
      const languageCookie = cookies.get('language');
      setLanguage(languageCookie);

      Axios.get('/invoices', {
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
            setInvoicesFilter(data['invoices']);
            setShowLoader(false);
          } else {
            if (data['error'] === 'token is invalid') {
              navigate(SIGN_IN);
            }
            toast.error('Error');
          }
        })
        .catch(() => {
          setShowLoader(false);
          toast.error(tradContent['internalError'][language]);
        });
    })();
  },[setLanguage, language, navigate]);
  
  return (
    <>
      <NavbarAccountAction />
      {showLoader ? <Loader /> : null}
      <Toaster />

      {!showLoader ? (
        <div className="invoice">
          <CustomTitle title={tradContent['invoicesTitle'][language]} />

          <Row>
            {invoicesFilter?.length === 0 && invoicesFilter && (
              <div className="notFound">{tradContent['noInvoicesFound'][language]} </div>
            )}
            {invoicesFilter &&
              invoicesFilter?.length > 0 &&
              invoicesFilter?.map((invoiceFilter) => {
                return (
                  <InvoiceCard
                    key={invoiceFilter['url']}
                    title={invoiceFilter['title']}
                    url={invoiceFilter['url']}
                  />
                );
              })}
          </Row>
        </div>
      ) : null}
    </>
  );
}

export default InvoiceListView;
