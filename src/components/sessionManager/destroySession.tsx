import Cookies from 'universal-cookie';

//Supprime le token d'authentification en vidant le localStorage et en supprimant en cookie token
export default function destroySession() {
  const cookies = new Cookies();
  cookies.remove('token', { path: '/', sameSite: 'Lax' });
  localStorage.setItem('auth_token', '');
}
