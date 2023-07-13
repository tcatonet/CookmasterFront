//Thomas Catonet
//VERSION 1.0

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInView from '../../view/SignInView';
import SignUpView from '../../view/SignUpView';
import SignUpConfirmationView from '../../view/SignUpConfirmationView';
import ResetPasswordView from '../../view/ResetPasswordView';
import ResetPasswordConfirmationView from '../../view/ResetPasswordConfirmationView';
import ForgotPasswordView from '../../view/ForgotPasswordView';
import ContactView from '../../view/ContactView';
import InvoiceListView from '../../view/account/listInvoice/InvoiceListView';
import DeleteAccountView from '../../view/account/DeleteAccountView';
import UpdateAccountView from '../../view/account/UpdateAccountView';
import UpdateAccountConfirmationView from '../../view/account/UpdateAccountConfirmationView';
import AccountView from '../../view/account/AccountView';
import UpdateSubAccount from '../../view/account/listSubAccount/UpdateSubAccount';
import DeleteSubAccount from '../../view/account/listSubAccount/DeleteSubAccount';
import CreateSubAccount from '../../view/account/listSubAccount/CreateSubAccount';

import SubAccountListView from '../../view/account/listSubAccount/SubAccountListView';
import ContactConnectedView from '../../view/account/ContactConnectedView';
import PageSubscribe from '../../view/account/PageSubscribe';
import EventView from '../../view/event/eventView';
import StoreView from '../../view/store/storeView';
import HomeView from '../../view/home/homeView';

import './navbar.css';
import {
  SIGN_IN,
  SIGN_UP,
  CONFIRMATION_EMAIL,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_RESET,
  FORGOT_PASSWORD_RESET_CONFIRMATION,
  ACCOUNT,
  ACCOUNT_UPDATE,
  ACCOUNT_DELETE,
  INVOICE_LIST,
  SUBSCRIBE,
  SUB_ACCOUNT,
  CONTACT,
  CONTACT_CONNECTED,
  SUB_ACCOUNT_UPDATE,
  SUB_ACCOUNT_DELETE,
  WRONG_ROOT,
  ACCOUNT_CONFIRMATION_UPDATE,
  SUB_ACCOUNT_CREATE,
  HOME,
  EVENT,
  STORE
} from './Root';

export default function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={SIGN_IN} element={<SignInView />}></Route>
        <Route path={SIGN_UP} element={<SignUpView />}></Route>
        <Route path={HOME} element={<HomeView />}></Route>
        <Route path={EVENT} element={<EventView />}></Route>
        <Route path={STORE} element={<StoreView />}></Route>

        <Route path={CONTACT} element={<ContactView />}></Route>
        <Route path={CONTACT_CONNECTED} element={<ContactConnectedView />}></Route>
        <Route path={ACCOUNT} element={<AccountView />}></Route>
        <Route path={CONFIRMATION_EMAIL} element={<SignUpConfirmationView />}></Route>
        <Route path={FORGOT_PASSWORD} element={<ForgotPasswordView />}></Route>
        <Route
          path={FORGOT_PASSWORD_RESET_CONFIRMATION}
          element={<ResetPasswordConfirmationView />}></Route>
        <Route path={FORGOT_PASSWORD_RESET} element={<ResetPasswordView />}></Route>
        <Route path={SUBSCRIBE} element={<PageSubscribe />}></Route>
        <Route path={ACCOUNT_UPDATE} element={<UpdateAccountView />}></Route>
        <Route
          path={ACCOUNT_CONFIRMATION_UPDATE}
          element={<UpdateAccountConfirmationView />}></Route>
        <Route path={INVOICE_LIST} element={<InvoiceListView />}></Route>
        <Route path={SUB_ACCOUNT} element={<SubAccountListView />}></Route>
        <Route path={ACCOUNT_DELETE} element={<DeleteAccountView />}></Route>
        <Route path={SUB_ACCOUNT_UPDATE} element={<UpdateSubAccount />}></Route>
        <Route path={SUB_ACCOUNT_DELETE} element={<DeleteSubAccount />}></Route>
        <Route path={SUB_ACCOUNT_CREATE} element={<CreateSubAccount />}></Route>
        <Route path={WRONG_ROOT} element={<SignInView />}></Route>
      </Routes>
    </BrowserRouter>
  );
}