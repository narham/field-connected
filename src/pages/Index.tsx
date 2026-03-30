import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Trophy, Shield, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Manajemen SSB",
    desc: "Kelola pemain, pelatih, jadwal latihan, absensi, dan pembayaran dalam satu platform.",
  },
  {
    icon: Trophy,
    title: "Kompetisi & Event",
    desc: "Buat dan kelola turnamen, liga, dan kompetisi grassroots dengan mudah.",
  },
  {
    icon: Shield,
    title: "Validasi Pemain",
    desc: "Database pemain terpusat dengan validasi umur otomatis anti kecurangan.",
  },
  {
    icon: BarChart3,
    title: "Statistik & Performa",
    desc: "Tracking perkembangan pemain, statistik pertandingan, dan klasemen otomatis.",
  },
];

const benefits = [
  "Single source of truth untuk semua data pemain",
  "SSB bisa langsung ikut kompetisi dari dashboard",
  "Klasemen dan top scorer otomatis terhitung",
  "Multi-tenant: data aman per organisasi",
  "Optimasi mobile untuk penggunaan di lapangan",
  "Riwayat performa pemain lintas kompetisi",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚽</span>
            </div>
            <span className="font-bold text-lg text-foreground">GrassRoots</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Daftar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            Platform Ekosistem
            <br />
            <span className="text-emerald-400">Sepak Bola Akar Rumput</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10"
          >
            Satu platform terpadu untuk SSB dan Event Organizer. Kelola pemain, kompetisi,
            dan performa — semua terhubung.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register?role=ssb">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                Daftar sebagai SSB <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/register?role=eo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base border-white/30 text-white hover:bg-white/10 hover:text-white">
                Daftar sebagai EO <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground mb-3">Fitur Utama</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Semua yang kamu butuhkan untuk mengelola akademi dan kompetisi sepak bola grassroots.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            Kenapa GrassRoots?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-start gap-3 bg-card rounded-lg border p-4"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Siap Memulai?
          </h2>
          <p className="text-muted-foreground mb-8">
            Bergabung sekarang dan digitalkan ekosistem sepak bola akar rumput kamu.
          </p>
          <Link to="/register">
            <Button size="lg" className="gap-2 text-base">
              Mulai Sekarang <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
              <span className="text-white text-xs">⚽</span>
            </div>
            <span className="font-semibold text-sm text-foreground">GrassRoots</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 GrassRoots. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
