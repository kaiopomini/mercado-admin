import { useEffect, useState, FormEvent} from 'react';
import { useNavigate } from 'react-router-dom'

import logoAdmin from '../../assets/img/logo-admin.png';
import logoBlue from '../../assets/img/logo-blue.png';
import logoYellow from '../../assets/img/logo-yellow.png';
import { useAuth } from '../../hooks/auth';


import './styles.scss';

export function Home() {

  const navigate = useNavigate();

  const {signIn, user } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  function navigateDashboard() {
    
    navigate('/');
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    const passLogin = await signIn(username, password);
    
    if(passLogin) {
      navigateDashboard()
    }
    
  }

  return (
    <div id='page-auth'>
      <aside>
        <img src={logoYellow} alt="ilustração"/>
        <strong>Mercado Campos</strong>
        <p>Dashboard Administrativo</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoBlue} alt="ilustração" />
          <div className="title-form" >Login</div>
          <form onSubmit={handleSignIn}>
            <input
              type="text"
              placeholder="Usuário"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button type="submit" >
              Entrar
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
