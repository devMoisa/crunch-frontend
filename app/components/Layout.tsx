import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Footer} from '~/components/Footer';
import {Navbar} from './Navbar';
import {AuthProvider} from '~/contexts/AuthContext';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
};

export function Layout({children = null}: LayoutProps) {
  return (
    <AuthProvider>
      <div className="grid grid-rows-layout min-h-screen bg-black text-white">
        <Navbar />
        <main className="row-start-2 row-end-3 bg-black flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
