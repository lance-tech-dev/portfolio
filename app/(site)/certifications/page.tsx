import Image from "next/image";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { getCertifications } from "@/lib/queries";
import { Certification } from "@/types/portfolio";

const UNCATEGORIZED = "Other";

function CertCard({ cert }: { cert: Certification }) {
  const content = (
    <>
      <div className="relative w-11 h-11 rounded-lg border border-neutral-800 bg-black shrink-0 flex items-center justify-center overflow-hidden">
        {cert.image_url ? (
          <Image
            src={cert.image_url}
            alt={cert.name}
            fill
            sizes="44px"
            className="object-contain"
          />
        ) : (
          <Award className="w-4 h-4 text-neutral-600" />
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white leading-snug">
          {cert.name}
        </h3>
        <p className="text-[10px] uppercase tracking-wider text-neutral-500">
          {cert.issuer}
        </p>
      </div>
      {cert.credential_url && (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-neutral-500 group-hover:text-white transition-colors">
          <ChevronLeft className="w-3 h-3" />
          verify
          <ChevronRight className="w-3 h-3" />
        </span>
      )}
    </>
  );

  const className =
    "group flex flex-col items-center text-center gap-3 p-6 border border-neutral-800 rounded-2xl bg-neutral-950/60 transition-colors";

  return cert.credential_url ? (
    <a
      href={cert.credential_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} hover:border-neutral-700`}
    >
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  const grouped = certifications.reduce<Record<string, Certification[]>>(
    (acc, cert) => {
      const key = cert.category || UNCATEGORIZED;
      acc[key] = acc[key] || [];
      acc[key].push(cert);
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped).sort((a, b) =>
    a === UNCATEGORIZED ? 1 : b === UNCATEGORIZED ? -1 : a.localeCompare(b)
  );

  return (
    <section className="space-y-8 font-mono">
      <div className="pb-3 border-b border-neutral-800 space-y-2">
        <h1 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          04 — CERTIFICATIONS
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl">
          Credentials I&apos;ve earned, verifiable at the source.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="p-8 border border-neutral-800 rounded-2xl bg-neutral-950/40 text-center text-xs text-neutral-500">
          No certifications listed yet.
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <h2 className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[category].map((cert) => (
                  <CertCard key={cert.id} cert={cert} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
