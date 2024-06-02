import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Footer} from '~/components/Footer';
import {Navbar} from './Navbar';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
};

export function Layout({children = null}: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
