import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';

const selectLanguage = {
  height: '9vh',
  width: '8vh',
  fontSize: '3vh',
  border: '0vh',
  backgroundColor: '#CFE2E4',
  color: '#174C4F'
};

const ENGLISH = 'english';
const FRANCAIS = 'francais';

export function getLanguageCookie() {
  const cookies = new Cookies();
  const languageCookie = cookies.get('language');
  return languageCookie;
}

const CustomSelectLanguage = () => {
  const [language, setLanguage] = React.useState('');
  useEffect(() => {
    const cookie: string = getLanguageCookie();
    setLanguage(cookie);

    if (cookie === ENGLISH || cookie === FRANCAIS) {
      setLanguage(cookie);
    } else {
      saveLanguage(ENGLISH);
    }
  }, []);

  async function saveLanguage(value: string) {
    const cookies = new Cookies();
    let expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + 1000 * 3600 * 120);
    cookies.set('language', value, { path: '/', expires: expirationTime, sameSite: 'Lax' });
    setLanguage(value);
    window.location.reload();
  }

  return (
    <select style={selectLanguage} value={language} onChange={(e) => saveLanguage(e.target.value)}>
      <option value="english">EN</option>
      <option value="francais">FR</option>
    </select>
  );
};

export default CustomSelectLanguage;
