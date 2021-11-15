
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/auth";

type Props = {
  children: JSX.Element;
  roles?: string[];
}

export function RequireAuth({ children, roles }: Props) {

  const { token, user } = useAuth();
  const userRoles = user?.roles?.map(role => role.name)
  let hasRole = false;
  roles?.length && roles?.forEach((role => {
    if (userRoles?.includes(role)) {
      hasRole = true;
    }

  }))

  const location = useLocation();

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (roles && !hasRole) {
    return (
      <>
        <div>Sem permissão</div>
      </>
    )
  }

  return children;
}