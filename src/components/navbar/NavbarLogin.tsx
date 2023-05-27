//Thomas Catonet
//VERSION 1.0

import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import './navbar.css';
import { SIGN_IN, CONTACT } from './Root';
import CustomSelectLanguage from '../select/language';
import tradContent from '../../assets/traduction/dictionary';

const NavbarLogin = () => {
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
          <Link to={CONTACT}> {tradContent['contactLabel'][language]} </Link>
        </li>
        <li className="active right">
          <Link className="active" to={SIGN_IN}>
            {tradContent['loginLabel'][language]}
          </Link>
        </li>
        <li className="right">
          <CustomSelectLanguage />
        </li>
      </ul>
    </header>
  );
};

export default NavbarLogin;
