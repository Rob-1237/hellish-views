import Image from "next/image";
import Modal from "./Modal";
import { site } from "@/data/site";

// Subscribing happens on Substack. This is Substack's own signup form (the
// public /embed page for the publication, no code needed from Harry), in a
// modal so readers never leave the site. Rendered once, in the header;
// anything else opens it with <ModalTrigger target="subscribe">, and
// /#subscribe opens it on load.
export default function SubscribeModal({ buttonClass = "btn btn--primary" }) {
  return (
    <Modal label="Subscribe" title="Get every review by email" eyebrow="Subscribe" buttonClass={buttonClass} hash="subscribe">
      <div className="subscribe-modal__intro">
        <Image src="/hellish-views-signature-image.jpg" alt="" width={486} height={705} sizes="6rem" className="subscribe-modal__thumb" />
        <p>
          Every review, story and poem goes out by email through Substack, where Harry's readers already are. Sign up
          below; it takes one email address.
        </p>
      </div>
      <iframe
        className="subscribe-modal__embed"
        src={`${site.substack}/embed`}
        title="Subscribe to Hellish Views on Substack"
        loading="lazy"
      />
      <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
        Trouble with the form? <a href={`${site.substack}/subscribe`}>Subscribe on Substack directly</a>.
      </p>
    </Modal>
  );
}
