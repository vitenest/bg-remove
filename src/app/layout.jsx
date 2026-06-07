import '../index.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'bg-remove.com - AI Background Remover',
  description: 'Remove backgrounds from images and videos effortlessly with advanced AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
