import Link from "next/link";
import Image from "next/image";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { getCertifications } from "@/lib/queries";

const PREVIEW_COUNT = 3;

export async function CertificationsSection() {
  const all = await getCertifications();
  const certifications = all.slice(0, PREVIEW_COUNT);

  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          04 — CERTIFICATIONS
        </h2>
        <Link
          href="/certifications"
          className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-wider font-semibold transition-colors"
        >
          ALL CERTIFICATIONS →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {certifications.map((cert) => {
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
              key={cert.id}
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${className} hover:border-neutral-700`}
            >
              {content}
            </a>
          ) : (
            <div key={cert.id} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
