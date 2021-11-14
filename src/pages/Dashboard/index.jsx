import './styles.scss';

import logoAdmin from '../../assets/img/logo-admin.png';
import logoBlue from '../../assets/img/logo-blue.png';
import logoYellow from '../../assets/img/logo-yellow.png';

export function Dashboard() {
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
          <div className="title-form">DASHBOARD</div>
          <form>
            <input
              type="text"
              placeholder="Usuário"
            />
            <input
              type="text"
              placeholder="Senha"
            />
            <button type="submit">
              Entrar
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
