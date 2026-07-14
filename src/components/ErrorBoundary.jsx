import { Component } from 'react';

/**
 * Captura errores de render en el árbol y muestra un fallback en vez de una
 * pantalla en blanco. Sigue el estilo de la landing (oscuro + lime).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            padding: '2rem',
            textAlign: 'center',
            background: '#0a0b0a',
            color: '#f4f5f0',
            fontFamily: "'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Algo salió mal
          </h1>
          <p style={{ color: '#c0c4b8', maxWidth: '32ch', lineHeight: 1.6, margin: 0 }}>
            Ocurrió un error inesperado. Intente recargar la página.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              fontFamily: "'Space Mono', ui-monospace, monospace",
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontSize: '12px',
              padding: '12px 22px',
              borderRadius: '100px',
              border: 'none',
              cursor: 'pointer',
              background: '#d8f24c',
              color: '#0a0b0a',
            }}
          >
            Volver al inicio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
