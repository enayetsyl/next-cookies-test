export const metadata = {
  title: "Next + Express Auth Demo",
  description: "Protected dashboard using cookie + middleware"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'system-ui', maxWidth: 720, margin: '40px auto', padding: '0 16px'}}>
        <header style={{display:'flex', gap:12, marginBottom:24}}>
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/dashboard">Dashboard</a>
        </header>
        {children}
      </body>
    </html>
  );
}
