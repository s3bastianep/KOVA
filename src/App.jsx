import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import DashboardPathEscape from './components/DashboardPathEscape';
import Landing from './pages/Landing';

const PageNotFound = lazy(() => import('./lib/PageNotFound'));
const Guias = lazy(() => import('./pages/Guias'));
const GuiaContratarComercial = lazy(() => import('./pages/GuiaContratarComercial'));
const GuiaEvaluacionComercial = lazy(() => import('./pages/GuiaEvaluacionComercial'));
const GuiaPsicometricasVsComercial = lazy(() => import('./pages/GuiaPsicometricasVsComercial'));
const GuiaRotacionComercial = lazy(() => import('./pages/GuiaRotacionComercial'));
const GuiaHabilidadesBlandasComercial = lazy(() => import('./pages/GuiaHabilidadesBlandasComercial'));
const Contacto = lazy(() => import('./pages/Contacto'));
const QuienesSomos = lazy(() => import('./pages/QuienesSomos'));
const ComoTrabajamos = lazy(() => import('./pages/ComoTrabajamos'));
const Servicios = lazy(() => import('./pages/Servicios'));

function App() {
  return (
    <Router>
      <DashboardPathEscape />
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/guias" element={<Guias />} />
          <Route path="/guia-contratar-comercial" element={<GuiaContratarComercial />} />
          <Route path="/guia-evaluacion-comercial" element={<GuiaEvaluacionComercial />} />
          <Route path="/guia-psicometricas-vs-comercial" element={<GuiaPsicometricasVsComercial />} />
          <Route path="/guia-rotacion-comercial" element={<GuiaRotacionComercial />} />
          <Route path="/guia-habilidades-blandas-comercial" element={<GuiaHabilidadesBlandasComercial />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/como-trabajamos" element={<ComoTrabajamos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
