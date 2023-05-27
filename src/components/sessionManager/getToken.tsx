import Cookies from 'universal-cookie';

//Reforme le token d'authentification à partir du cookie et du localStorage
export default function getToken() {
  const cookies = new Cookies();
  const tokenCookie = cookies.get('token');
  const tokenLocalStorage = localStorage.getItem('token');
  return tokenCookie + tokenLocalStorage || '';
}

