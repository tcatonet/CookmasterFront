//Thomas Catonet
//VERSION 1.0

import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import './navbar.css';
import destroySession from '../sessionManager/destroySession';
import { HOME, ACCOUNT, EVENT, STORE, SIGN_IN } from './Root';
import CustomSelectLanguage from '../select/language';
import tradContent from '../../assets/traduction/dictionary';

const NavbarAccount = () => {
  const [language, setLanguage] = React.useState('');
  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  return (
    <header className="navbar navbar-expand-lg navbar-light fixed-top">
      <ul>
        <li className="right">
          <Link to={SIGN_IN} onClick={destroySession}>
            {tradContent['logoutLabel'][language]}
          </Link>
        </li>
        <li className="right">
          <CustomSelectLanguage />
        </li>

        <li className="left">
          <Link to={HOME}> {tradContent['homeLabel'][language]} </Link>
        </li>
        <li className="left">
          <Link className="active" to={EVENT}> {tradContent['eventLabel'][language]} </Link>
        </li>
        <li className="left">
          <Link to={STORE}> {tradContent['storeLabel'][language]} </Link>
        </li>
        <li className="left">
          <Link to={ACCOUNT}>
            {tradContent['accountLabel'][language]}
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default NavbarAccount;
