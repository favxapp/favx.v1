'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, type ReactNode } from 'react';
import type { Messages } from '@/lib/i18n/messages';
import { Icon, type IconName } from '@/components/ui/Icon';

export function AppShell({ children, name, photo, creator, locale, labels: m, libraryLabels: l }: {
  children: ReactNode; name: string; photo: string | null; creator: boolean; locale: string; labels: Messages['workspace']; libraryLabels: Messages['library'];
}) {
  const path = usePathname();
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const links: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
    { href: '/app/me', label: m.home, icon: 'home', exact: true },
    { href: '/app/salvos', label: l.saved, icon: 'bookmark' },
    { href: '/app/colecoes', label: l.collections, icon: 'layers' },
    ...(creator ? [
      { href: '/app/creator', label: m.studio, icon: 'sparkles' as const, exact: true },
      { href: '/app/creator/posts', label: m.posts, icon: 'grid' as const },
      { href: '/app/creator/collections', label: m.collections, icon: 'layers' as const },
      { href: '/app/creator/profile', label: m.profile, icon: 'user' as const },
    ] : [{ href: '/app/creator/activate', label: m.becomeCreator, icon: 'sparkles' as const }]),
  ];
  return <div className="workspace">
    <a href="#main" className="skip-link">{m.skip}</a>
    <aside className="workspace-sidebar glass-panel">
      <Link href="/app/me" aria-label="FAVX" className="wordmark">FAVX</Link>
      <div className="workspace-identity">{photo ? <img src={photo} alt="" width={36} height={36} /> : <span className="identity-letter" aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>}<div><strong>{name}</strong><span>{creator ? m.creatorSpace : m.yourSpace}</span></div></div>
      <p className="nav-caption">{m.workspace}</p>
      <nav aria-label={m.navigation} className="workspace-nav">{links.map(item => <Link key={item.href} href={item.href} aria-current={(item.exact ? path === item.href : path.startsWith(item.href)) ? 'page' : undefined}><Icon name={item.icon} /><span>{item.label}</span></Link>)}</nav>
      {creator && <Link href="/app/creator/posts/novo" className="button-primary sidebar-create"><Icon name="plus" />{m.newPost}</Link>}
      <div className="sidebar-bottom"><Link href="/app/settings" className="nav-utility"><Icon name="user" />{m.settings}</Link><Link href={`/${locale}/ajuda`} className="nav-utility"><Icon name="help" />{m.help}</Link><form action="/auth/signout" method="post"><input type="hidden" name="locale" value={locale} /><button className="nav-utility" type="submit"><Icon name="logout" />{m.signOut}</button></form><span className="sidebar-note">{m.tagline}</span></div>
    </aside>
    <header className="mobile-top">
      <Link href="/app/me" className="wordmark">FAVX</Link>
      <details ref={mobileMenu} className="mobile-menu" onKeyDown={event => {
        if (event.key === 'Escape' && mobileMenu.current?.open) {
          mobileMenu.current.open = false;
          mobileMenu.current.querySelector('summary')?.focus();
        }
      }}>
        <summary aria-label={m.navigation}><Icon name="menu" /></summary>
        <nav className="glass-panel" aria-label={m.navigation} onClick={event => {
          if ((event.target as Element).closest('a') && mobileMenu.current) mobileMenu.current.open = false;
        }}>
          {links.map(item => <Link key={item.href} href={item.href} className="nav-utility"><Icon name={item.icon} />{item.label}</Link>)}
          <Link href="/app/settings" className="nav-utility"><Icon name="user" />{m.settings}</Link>
          <Link href={`/${locale}/ajuda`} className="nav-utility"><Icon name="help" />{m.help}</Link>
          <form action="/auth/signout" method="post"><input type="hidden" name="locale" value={locale} /><button type="submit" className="nav-utility"><Icon name="logout" />{m.signOut}</button></form>
        </nav>
      </details>
    </header>
    <div className="workspace-content">{children}</div>
    <nav className="mobile-dock glass-panel" aria-label={m.navigation}>
      <Link href="/app/me" aria-label={m.home} aria-current={path === '/app/me' ? 'page' : undefined}><Icon name="home" /></Link>
      <Link href="/app/salvos" aria-label={l.saved} aria-current={path.startsWith('/app/salvos') ? 'page' : undefined}><Icon name="bookmark" /></Link>
      {creator && <><Link className="dock-create" href="/app/creator/posts/novo" aria-label={m.newPost}><Icon name="plus" /></Link></>}
      <Link href={creator ? '/app/creator/profile' : '/app/creator/activate'} aria-label={m.profile} aria-current={path === '/app/creator/profile' ? 'page' : undefined}><Icon name="user" /></Link>
      <Link href={`/${locale}/ajuda`} aria-label={m.help}><Icon name="help" /></Link>
    </nav>
  </div>;
}
