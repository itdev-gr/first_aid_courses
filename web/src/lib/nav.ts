// web/src/lib/nav.ts
export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: 'Αρχική',       href: '/' },
  { label: 'Σεμινάρια',    href: '/seminaria/' },
  { label: 'Επιχειρήσεις', href: '/etairikoi/' },
  { label: 'Τιμοκατάλογος', href: '/timokatalogos/' },
  { label: 'Σχετικά',      href: '/sxetika/' },
  { label: 'Επικοινωνία',  href: '/epikoinonia/' },
];

export const ctaNav: NavItem = { label: 'Πληροφορίες', href: '/kratisi/' };

export const phone = {
  display: '+30 697 168 8716',
  tel:     '+306971688716',
  email:   'info@firstaid-academy.gr',
};
