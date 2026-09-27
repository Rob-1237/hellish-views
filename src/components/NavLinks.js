"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  ["/", "Home"],
  ["/reviews", "Reviews"],
  ["/writing", "Writing"],
  ["/posts", "Posts"],
  ["/contents", "Contents"],
];

// Marks the current section. Series pages sit under Posts now.
export default function NavLinks() {
  const path = usePathname();
  const current = (href) =>
    href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`) || (href === "/posts" && path.startsWith("/series/"));
  return nav.map(([href, label]) => (
    <Link key={href} href={href} aria-current={current(href) ? "page" : undefined}>
      {label}
    </Link>
  ));
}
