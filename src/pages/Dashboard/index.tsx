import { useAuth } from '../../hooks/auth';
import './styles.scss';



export function Dashboard() {
  const {signOut} = useAuth();
  return (
    <div id='page-dashboard'>
      Dashboard
      <button onClick={signOut}> sair</button>
    </div>
  );
}
