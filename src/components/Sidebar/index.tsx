import "./styles.scss";

import { PermIdentity, Storefront, BarChart, Home } from "@material-ui/icons";

import {
  Badge,
  Category,
  ShoppingCartCheckout,
  ProductionQuantityLimits,
  LocalOffer,
  Star,
  NotificationAdd,
  TrendingUp,
  SupervisedUserCircle,
} from "@mui/icons-material";

import logo from "../../assets/img/logo-blue.png";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export function Sidebar() {
  const location = useLocation();

  function selectActiveButton() {
    const sidebarMenu = document.getElementById("sidebarMenu");
    const links = sidebarMenu && sidebarMenu.getElementsByTagName("a");
    if (links) {
      for (let i: number = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.href.split("/");
        const hrefFull = "/" + href[3];
        if (location.pathname === hrefFull) {
          const item = link.firstChild as HTMLElement;
          item && item.classList.add("active");
        } else {
          const item = link.firstChild as HTMLElement;
          item && item.classList.remove("active");
        }
      }
    }
  }

  useEffect(() => {
    selectActiveButton();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="sidebar__items-container">
        <div className="sidebarWrapper" id="sidebarMenu">
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Dashboard</h3>
            <ul className="sidebarList">
              <Link to="/" className="link">
                <li className="sidebarListItem">
                  <Home className="sidebarIcon" />
                  Home
                </li>
              </Link>
              <Link to="/notificacao/pedidos" className="link">
                <li className="sidebarListItem">
                  <ProductionQuantityLimits className="sidebarIcon" />
                  Pedidos Abertos
                </li>
              </Link>
            </ul>
          </div>
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Gerência</h3>
            <ul className="sidebarList">
              <Link to="/produtos" className="link">
                <li className="sidebarListItem">
                  <Storefront className="sidebarIcon" />
                  Produtos
                </li>
              </Link>
              <Link to="/categorias" className="link">
                <li className="sidebarListItem">
                  <Category className="sidebarIcon" />
                  Categorias
                </li>
              </Link>
              <Link to="/usuarios" className="link">
                <li className="sidebarListItem">
                  <PermIdentity className="sidebarIcon" />
                  Usuários
                </li>
              </Link>
              <Link to="/colaboradores" className="link">
                <li className="sidebarListItem">
                  <Badge className="sidebarIcon" />
                  Colaboradores
                </li>
              </Link>
              <Link to="/pedidos" className="link">
                <li className="sidebarListItem">
                  <ShoppingCartCheckout className="sidebarIcon" />
                  Pedidos
                </li>
              </Link>
            </ul>
          </div>
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Aplicativo</h3>
            <ul className="sidebarList">
              <Link to="/app/destaques" className="link">
                <li className="sidebarListItem">
                  <Star className="sidebarIcon" />
                  Destaques
                </li>
              </Link>
              <Link to="/app/ofertas" className="link">
                <li className="sidebarListItem">
                  <LocalOffer className="sidebarIcon" />
                  Ofertas
                </li>
              </Link>
              <Link to="/app/notificacoes" className="link">
                <li className="sidebarListItem">
                  <NotificationAdd className="sidebarIcon" />
                  Notificações
                </li>
              </Link>
            </ul>
          </div>
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Relatórios</h3>
            <ul className="sidebarList">
              <Link to="/relatorios/vendas" className="link">
                <li className="sidebarListItem">
                  <TrendingUp className="sidebarIcon" />
                  Vendas
                </li>
              </Link>
              <Link to="/relatorios/produtos" className="link">
                <li className="sidebarListItem">
                  <BarChart className="sidebarIcon" />
                  Produtos
                </li>
              </Link>
              <Link to="/relatorios/usuarios" className="link">
                <li className="sidebarListItem">
                  <SupervisedUserCircle className="sidebarIcon" />
                  Usúarios
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
