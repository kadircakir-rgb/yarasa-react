export default function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '3px solid rgba(230,27,35,0.15)',
          borderTopColor: '#e61b23',
          animation: 'pageLoaderSpin 0.75s linear infinite',
        }}
      />
      <div
        style={{
          marginTop: '16px',
          color: '#64748b',
          fontSize: '13.5px',
          fontWeight: 500,
          letterSpacing: '0.3px',
        }}
      >
        Yükleniyor...
      </div>
      <style>{`
        @keyframes pageLoaderSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
