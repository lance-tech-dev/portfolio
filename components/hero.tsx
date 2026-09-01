import Image from "next/image";
import { Mail, ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import { portfolioData } from "@/app/data/portfolio-data";

export function Hero() {
  const roleParts = portfolioData.header.role.split(" | ");

  return (
    <section className="flex flex-col-reverse lg:flex-row justify-between items-center mb-32 gap-12 lg:gap-8 relative">

      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] -z-10 rounded-full" />

      {/* Left Side: Text Content */}
      <div className="flex-1 space-y-8 text-center lg:text-left z-10">

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Open for Freelance Website Projects
        </div>

        <div className="space-y-5">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">{portfolioData.header.name}</span>
          </h1>
          <h2 className="text-lg md:text-xl font-semibold tracking-wide text-emerald-600 dark:text-emerald-400">
            {roleParts.map((part, index) => {
              if (index === 0) {
                return <span key={part}>{part}</span>;
              }
              const [firstWord, ...rest] = part.split(" ");
              return (
                <span key={part}>
                  {" "}
                  <span className="whitespace-nowrap">
                    <span className="text-zinc-400 dark:text-zinc-600">•</span> {firstWord}
                  </span>
                  {rest.length > 0 ? ` ${rest.join(" ")}` : ""}
                </span>
              );
            })}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg max-w-2xl mx-auto lg:mx-0">
            {portfolioData.header.bio}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
          <a
            href={portfolioData.header.socials.email}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Mail size={18} />
            <span>Get in touch</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>

          <div className="flex gap-4">
            <a
              href={portfolioData.header.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-emerald-500/50 hover:text-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <FaGithub size={22} />
            </a>
            <a
              href={portfolioData.header.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-emerald-500/50 hover:text-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href={portfolioData.header.socials.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook profile"
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-emerald-500/50 hover:text-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <FaFacebook size={22} />
            </a>
            <a
              href={portfolioData.header.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram profile"
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-emerald-500/50 hover:text-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <FaInstagram size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Right Side: Profile Image */}
      <div className="relative group w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 shrink-0 z-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-700"></div>
        <Image
          src="/profile.jpg"
          alt={portfolioData.header.name}
          fill
          sizes="(max-width: 768px) 224px, (max-width: 1024px) 256px, 320px"
          priority
          className="object-cover rounded-full shadow-2xl border-4 border-white dark:border-zinc-900 transition-all duration-700 group-hover:-translate-y-3 group-hover:rotate-2 ring-1 ring-zinc-200 dark:ring-zinc-800"
        />
      </div>
    </section>
  );
}
