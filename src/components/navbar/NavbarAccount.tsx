//Thomas Catonet
//VERSION 1.0

import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import './navbar.css';
import destroySession from '../sessionManager/destroySession';
import { SIGN_IN, PROJECT_LIST, ACCOUNT, CONTACT_CONNECTED } from './Root';
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
        <li className=" right">
          <Link to={CONTACT_CONNECTED}> {tradContent['contactLabel'][language]} </Link>
        </li>
        <li className="active right">
          <Link className="active" to={ACCOUNT}>
            {tradContent['accountLabel'][language]}
          </Link>
        </li>
        <li className="right">
          <Link to={PROJECT_LIST}> {tradContent['projectsLabel'][language]} </Link>
        </li>
        <li className="right">
          <CustomSelectLanguage />
        </li>
      </ul>
    </header>
  );
};

export default NavbarAccount;
