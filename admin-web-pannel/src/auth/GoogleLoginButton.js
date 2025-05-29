import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode }  from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const allowedEmail = 'mikelmodeiro2004@gmail.com';

export default function GoogleLoginButton({ setUser }) {
  const navigate = useNavigate();

  const onSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    if (decoded.email === allowedEmail) {
      setUser(decoded);
      navigate('/home');
    } else {
      alert('Access denied. This email is not authorized.');
      googleLogout();
    }
  };

  return <GoogleLogin onSuccess={onSuccess} onError={() => alert('Login failed')} />;
}
