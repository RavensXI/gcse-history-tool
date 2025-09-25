import './globals.css'

export const metadata = {
  title: 'GCSE History Assessment Tool',
  description: 'Track student progress across GCSE History content areas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}