import SubscribeBlock from "@/components/SubscribeBlock";
export const metadata = { title: "Subscribe" };
export default function SubscribePage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Subscribe</h1>
        <p>Substack is where Hellish Views goes out. The pitch, and the embed, go here. Sample copy.</p>
      </div>
      <div className="prose">
        <p>Sample pitch paragraph: what you get, how often, why it's worth an inbox slot.</p>
      </div>
      <div style={{ marginBlock: "var(--space-8)" }}>
        <SubscribeBlock />
      </div>
    </div>
  );
}
