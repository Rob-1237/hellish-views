import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page-head">
      <h1>Not here</h1>
      <p>Nothing at this address. Try the <Link href="/index">contents page</Link>.</p>
    </div>
  );
}
