import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import Landing from './pages/Landing';
import Guias from './pages/Guias';
import GuiaContratarComercial from './pages/GuiaContratarComercial';
import GuiaEvaluacionComercial from './pages/GuiaEvaluacionComercial';
import GuiaPsicometricasVsComercial from './pages/GuiaPsicometricasVsComercial';
import GuiaRotacionComercial from './pages/GuiaRotacionComercial';
import GuiaHabilidadesBlandasComercial from './pages/GuiaHabilidadesBlandasComercial';
import Contacto from './pages/Contacto';
import QuienesSomos from './pages/QuienesSomos';
import ComoTrabajamos from './pages/ComoTrabajamos';
import Servicios from './pages/Servicios';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
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
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
