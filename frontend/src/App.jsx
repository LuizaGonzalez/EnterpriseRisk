import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState('');

  async function callApi() {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/risk-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.text();
      if (!response.ok) {
        throw new Error(`API returned ${response.status}${body ? `: ${body}` : ''}`);
      }
      setResult(JSON.stringify(JSON.parse(body), null, 2));
    } catch (error) {
      setResult(`Request failed: ${error.message}`);
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '40px auto', padding: 24, background: '#fff', border: '1px solid #ccc', borderRadius: 12, textAlign: 'center'}}>
      <h1>Enterprise Risk Lab</h1>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log in</button>
      ) : (
        <>
          <p>Signed in as {user.name}</p>
          <button onClick={callApi}>Call protected API</button>{' '}
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log out
          </button>
          <pre>{result}</pre>
        </>
      )}
    </main>
  );
}