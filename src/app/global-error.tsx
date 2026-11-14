'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'Arial, sans-serif', padding: 32 }}>
        <h1>Algo deu errado · Something went wrong</h1>
        <button type="button" onClick={reset} style={{ minHeight: 44, padding: '8px 20px' }}>
          Tentar de novo · Try again
        </button>
      </body>
    </html>
  );
}
