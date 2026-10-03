// src/components/layout/AboutLayout/TeamSection.tsx
import { motion } from "framer-motion";
import { Users, Phone, Linkedin, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TEAM_MEMBERS } from "./constants";
import { fadeInUp, staggerContainer } from "./animations";

export default function TeamSection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12 md:mb-16 lg:mb-20 space-y-4"
        >
          <motion.div variants={fadeInUp} custom={0}>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5">
              <Users className="size-3 mr-1.5" />
              Leadership Team
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            custom={1}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            The People Behind
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-primary dark:from-blue-400 dark:to-primary">
              Every Enterprise Win
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-2"
          >
            Seasoned operators, strategists, and builders who've scaled supply
            chains for global enterprises.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gradient-to-b dark:from-white/5 dark:to-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-primary/40 dark:hover:border-primary/40 shadow-lg dark:shadow-2xl hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-500">
                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Role Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                      <member.badgeIcon className="h-3 w-3 text-[#FF5500]" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                        {member.badge}
                      </span>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={member.linkedin}
                      className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all"
                      aria-label="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-lg md:text-xl font-black text-white tracking-tight mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-[#FF5500] uppercase tracking-widest">
                      {member.position}
                    </p>
                  </div>
                </div>

                {/* Quote & Bio */}
                <div className="p-6 space-y-4">
                  <div className="relative pl-4 border-l-2 border-primary/40">
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{member.quote}"
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                    <a
                      href={`tel:${member.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      {member.phone}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}