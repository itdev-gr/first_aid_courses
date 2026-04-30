// web/src/lib/nav.ts
export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: 'Αρχική',       href: '/' },
  { label: 'Σεμινάρια',    href: '/seminaria/' },
  { label: 'Επιχειρήσεις', href: '/etairikoi/' },
  { label: 'Σχετικά',      href: '/sxetika/' },
  { label: 'Επικοινωνία',  href: '/epikoinonia/' },
];

export const ctaNav: NavItem = { label: 'Κράτηση', href: '/kratisi/' };

export const phone = {
  display: '+30 6900 000000',
  tel:     '+306900000000',
  email:   'info@firstaidacademy.gr',
};
