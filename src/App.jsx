import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import DashboardPathEscape from './components/DashboardPathEscape';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/landing/Navbar';
import HomeDark from './pages/HomeDark';
import Landing from './pages/Landing';
import Empleo from './pages/Empleo';
import Contacto from './pages/Contacto';
import Privacidad from './pages/Privacidad';
import Guias from './pages/Guias';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Acceso from './pages/Acceso';

const PageNotFound = lazy(() => import('./lib/PageNotFound'));
const GuiaContratarComercial = lazy(() => import('./pages/GuiaContratarComercial'));
const GuiaEvaluacionComercial = lazy(() => import('./pages/GuiaEvaluacionComercial'));
const GuiaPsicometricasVsComercial = lazy(() => import('./pages/GuiaPsicometricasVsComercial'));
const GuiaRotacionComercial = lazy(() => import('./pages/GuiaRotacionComercial'));
const GuiaHabilidadesBlandasComercial = lazy(() => import('./pages/GuiaHabilidadesBlandasComercial'));

const AUTH_PATHS = new Set(['/login', '/registro', '/acceso']);

function AppShell() {
  const { pathname } = useLocation();
  const isAuth = AUTH_PATHS.has(pathname);
  const isHome = pathname === '/';

  return (
    <ErrorBoundary>
      {!isAuth && !isHome ? <Navbar /> : null}
      <div className={isAuth || isHome ? undefined : 'kova-route-shell'}>
        <Suspense fallback={isAuth || isHome ? null : <div className="kova-route-shell__fallback" aria-hidden />}>
          <Routes>
            <Route path="/" element={<HomeDark />} />
            <Route path="/dark" element={<Navigate to="/" replace />} />
            <Route path="/claro" element={<Navigate to="/" replace />} />
            <Route path="/para-empresas" element={<Landing />} />
            <Route path="/empleo" element={<Empleo />} />
            <Route path="/guias" element={<Guias />} />
            <Route path="/blog" element={<Navigate to="/guias" replace />} />
            <Route path="/guia-contratar-comercial" element={<GuiaContratarComercial />} />
            <Route path="/guia-evaluacion-comercial" element={<GuiaEvaluacionComercial />} />
            <Route path="/guia-psicometricas-vs-comercial" element={<GuiaPsicometricasVsComercial />} />
            <Route path="/guia-rotacion-comercial" element={<GuiaRotacionComercial />} />
            <Route path="/guia-habilidades-blandas-comercial" element={<GuiaHabilidadesBlandasComercial />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/servicios" element={<Navigate to="/para-empresas" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/acceso" element={<Acceso />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <DashboardPathEscape />
      <ScrollToTop />
      <AppShell />
    </Router>
  );
}

export default App;
