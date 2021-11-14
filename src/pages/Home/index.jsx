import { useNavigate } from 'react-router-dom'

import logoAdmin from '../../assets/img/logo-admin.png';
import logoBlue from '../../assets/img/logo-blue.png';
import logoYellow from '../../assets/img/logo-yellow.png';

import './styles.scss';

export function Home() {

  const navigate = useNavigate();

  function navigateDashboard() {
    navigate('/dashboard');
  }

  function signIn() {
    
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
          <form>
            <input
              type="text"
              placeholder="Usuário"
            />
            <input
              type="text"
              placeholder="Senha"
            />
            <button onClick={navigateDashboard} type="submit">
              Entrar
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
