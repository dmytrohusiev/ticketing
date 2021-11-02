import { FC } from "react";
import Link from "next/link";
import { CurrentUser } from "../../types/current-user";

const links = [
  {
    label: "Sign Up",
    href: "/auth/signup",
    isAvailable: (currentUser: CurrentUser | null) => !currentUser
  },
  {
    label: "Sign In",
    href: "/auth/signin",
    isAvailable: (currentUser: CurrentUser | null) => !currentUser
  },
  { label: "Sell Tickets", href: "/tickets/new", isAvailable: (currentUser: CurrentUser | null) => !!currentUser },
  { label: "My Orders", href: "/orders", isAvailable: (currentUser: CurrentUser | null) => !!currentUser },
  {
    label: "Sign Out",
    href: "/auth/signout",
    isAvailable: (currentUser: CurrentUser | null) => !!currentUser
  }
];

export const Header: FC<{ currentUser: { id: string; email: string } | null }> = ({ currentUser }) => {
  const linksToUse = links.filter(({ isAvailable }) => isAvailable(currentUser));
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {linksToUse.map(({ label, href }) => (
            <li key={href} className="nav-item">
              <Link href={href}>
                <a className="nav-link">{label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
