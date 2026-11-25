import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type TargetAndTransition,
  type Variants,
} from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  CreditCard,
  Fingerprint,
  Lock,
  Menu,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Brand } from '../components/layout/Brand';
import '../landing.css';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const viewport = { once: true, amount: 0.15 } as const;

const TICKER = ['Instant Naira transfers', 'Zero transfer fees', 'Virtual cards', 'Beneficiaries', '2-factor security', 'Real-time notifications', 'Web & mobile'];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="lp-container lp-nav-inner">
        <Brand />
        <nav className={`lp-links ${open ? 'open' : ''}`}>
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#how" onClick={() => setOpen(false)}>How it works</a>
          <a href="#stories" onClick={() => setOpen(false)}>Stories</a>
          <a href="#security" onClick={() => setOpen(false)}>Security</a>
          <Link to="/login" className="lp-btn ghost lp-mobile-only">Log in</Link>
          <Link to="/register" className="lp-btn primary lp-mobile-only">Get started</Link>
        </nav>
        <div className="lp-nav-actions">
          <Link to="/login" className="lp-btn ghost">Log in</Link>
          <Link to="/register" className="lp-btn primary">
            Get started <ArrowRight size={16} />
          </Link>
        </div>
        <button type="button" className="lp-burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function PhoneMock() {
  const reduce = useReducedMotion();
  const float: TargetAndTransition = reduce ? {} : { y: [0, -10, 0] };
  return (
    <motion.div className="lp-phone" animate={float} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
      <div className="lp-phone-notch" />
      <div className="lp-phone-screen">
        <div className="lp-ph-head">
          <div>
            <small>Good morning</small>
            <strong>Dammie</strong>
          </div>
          <img src="/landing/dami-1.jpg" alt="" className="lp-ph-avatar" />
        </div>
        <div className="lp-ph-balance">
          <small>Total balance</small>
          <motion.strong initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
            ₦248,350<span>.00</span>
          </motion.strong>
          <div className="lp-ph-acct">
            <span>0123 4567 89</span>
            <span>LolaPay Wallet</span>
          </div>
        </div>
        <div className="lp-ph-actions">
          {['Send', 'Request', 'Cards', 'More'].map((a) => (
            <div key={a}>
              <span />
              {a}
            </div>
          ))}
        </div>
        <div className="lp-ph-list">
          {[
            { n: 'Mum', a: '+₦25,000', c: 'in' },
            { n: 'Aunty Bisi Styles', a: '−₦18,500', c: 'out' },
            { n: 'Tope Adeyemi', a: '+₦12,000', c: 'in' },
            { n: 'Netflix', a: '−₦4,400', c: 'out' },
          ].map((t, i) => (
            <motion.div
              key={t.n}
              className="lp-ph-row"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.15 }}
            >
              <span className={`lp-ph-ico ${t.c}`}>{t.c === 'in' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}</span>
              <span className="lp-ph-name">{t.n}</span>
              <span className={`lp-ph-amt ${t.c}`}>{t.a}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const drift = (d: number): TargetAndTransition =>
    reduce ? {} : { y: [0, -14, 0], transition: { duration: 5 + d, repeat: Infinity, ease: 'easeInOut', delay: d } };
  return (
    <section className="lp-hero">
      <div className="lp-blob a" />
      <div className="lp-blob b" />
      <div className="lp-grid-bg" />
      <div className="lp-container lp-hero-inner">
        <motion.div className="lp-hero-copy" variants={stagger} initial="hidden" animate="show">
          <motion.span className="lp-pill" variants={fadeUp}>
            <Sparkles size={14} /> Peer-to-peer Naira wallet
          </motion.span>
          <motion.h1 variants={fadeUp}>
            Send money to the <span className="lp-grad">people you love</span> — in a heartbeat.
          </motion.h1>
          <motion.p variants={fadeUp}>
            LolaPay is the simplest way to move Naira between friends and family. Instant transfers, virtual cards, saved beneficiaries and
            a full history — all in one beautifully simple app.
          </motion.p>
          <motion.div className="lp-cta-row" variants={fadeUp}>
            <Link to="/register" className="lp-btn primary lg">
              Open a free account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="lp-btn outline lg">
              I already have one
            </Link>
          </motion.div>
          <motion.div className="lp-trust" variants={fadeUp}>
            <div className="lp-avatars">
              <img src="/landing/dami-1.jpg" alt="" />
              <img src="/landing/dami-2.jpg" alt="" />
              <img src="/landing/dami-3.jpg" alt="" />
            </div>
            <div>
              <div className="lp-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <small>Loved by 12,000+ Nigerians</small>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="lp-hero-visual" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <PhoneMock />
          <motion.div className="lp-float card1" animate={drift(0)}>
            <img src="/landing/dami-2.jpg" alt="Dammie" />
            <div>
              <strong>Dammie sent you</strong>
              <span className="in">+₦15,000</span>
            </div>
          </motion.div>
          <motion.div className="lp-float card2" animate={drift(1.2)}>
            <span className="lp-float-ico">
              <Send size={16} />
            </span>
            <div>
              <strong>Transfer complete</strong>
              <span>to @dami_lola · just now</span>
            </div>
          </motion.div>
          <motion.div className="lp-float card3" animate={drift(0.6)}>
            <img src="/landing/dami-3.jpg" alt="" />
            <div>
              <strong>New beneficiary</strong>
              <span>Dammie added you back</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="lp-ticker" aria-hidden>
      <div className="lp-ticker-track">
        {items.map((t, i) => (
          <span key={i}>
            <Sparkles size={12} /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Counter({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  useEffect(() => {
    if (!inView || reduce) return;
    const t0 = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return (
    <span ref={ref}>
      {prefix}
      {v.toLocaleString('en-NG')}
      {suffix}
    </span>
  );
}

function Stats() {
  const stats = [
    { to: 12000, suffix: '+', label: 'Happy Nigerians' },
    { to: 480, prefix: '₦', suffix: 'M+', label: 'Moved every month' },
    { to: 0, prefix: '₦', label: 'Transfer fees. Ever.' },
    { to: 1, prefix: '<', suffix: 's', label: 'Average transfer time' },
  ];
  return (
    <section className="lp-stats">
      <div className="lp-container">
        <motion.div className="lp-stats-grid" variants={stagger} initial="hidden" whileInView="show" viewport={viewport}>
          {stats.map((s) => (
            <motion.div key={s.label} className="lp-stat" variants={fadeUp}>
              <strong>
                <Counter to={s.to} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} />
              </strong>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SendDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 1800);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <div className="lp-demo">
      <div className="lp-demo-head">
        <img src="/landing/dami-2-face.png" alt="" />
        <div>
          <strong>Dammie</strong>
          <small>@dami_lola · 0123 4567 89</small>
        </div>
        <span className="lp-demo-fav">
          <Star size={12} fill="currentColor" /> Favourite
        </span>
      </div>
      <div className="lp-demo-amount">
        <small>Amount</small>
        <AnimatePresence mode="wait">
          <motion.strong key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {step === 0 ? '₦0' : step === 1 ? '₦15,0' : '₦15,000'}
            {step <= 1 && <span className="lp-caret" />}
          </motion.strong>
        </AnimatePresence>
      </div>
      <div className="lp-demo-note">{step >= 2 ? 'For the shoes 👟' : 'Add a note…'}</div>
      <motion.button type="button" className={`lp-demo-btn ${step === 3 ? 'done' : ''}`} animate={step === 2 ? { scale: [1, 0.96, 1] } : {}} transition={{ duration: 0.4 }}>
        {step === 3 ? (
          <>
            <Check size={16} /> Sent · ₦0 fee
          </>
        ) : (
          <>
            <Send size={16} /> Send money
          </>
        )}
      </motion.button>
      <AnimatePresence>
        {step === 3 && (
          <motion.div className="lp-demo-toast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Bell size={14} /> Dammie was notified instantly
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Features() {
  const reduce = useReducedMotion();
  return (
    <section id="features" className="lp-section">
      <div className="lp-container">
        <motion.div className="lp-section-head" variants={stagger} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.span className="lp-eyebrow" variants={fadeUp}>Everything a wallet should do</motion.span>
          <motion.h2 variants={fadeUp}>Built for how Nigerians actually move money</motion.h2>
          <motion.p variants={fadeUp}>No hidden fees, no confusing menus. Just the features you use every day, done properly.</motion.p>
        </motion.div>

        <motion.div className="lp-bento" variants={stagger} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.article className="lp-tile big" variants={fadeUp}>
            <div>
              <span className="lp-feature-ico">
                <Zap size={22} />
              </span>
              <h3>Instant transfers</h3>
              <p>Pick a person, type an amount, tap send. The money lands before the notification sound finishes.</p>
            </div>
            <SendDemo />
          </motion.article>

          <motion.article className="lp-tile photo" variants={fadeUp} whileHover={{ y: -6 }}>
            <img src="/landing/dami-1-fade.jpg" alt="" />
            <div className="lp-tile-photo-copy">
              <span className="lp-feature-ico light">
                <Users size={20} />
              </span>
              <h3>Beneficiaries</h3>
              <p>Save the people you pay often. Favourites float to the top.</p>
            </div>
            <motion.div className="lp-chip-stack" animate={reduce ? {} : { y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              {['Mum', 'Aunty Bisi', 'Tope'].map((n, i) => (
                <span key={n} style={{ transform: `translateX(${i * 10}px)` }}>
                  <img src={`/landing/dami-${(i % 3) + 1}-face.png`} alt="" /> {n}
                </span>
              ))}
            </motion.div>
          </motion.article>

          <motion.article className="lp-tile card" variants={fadeUp} whileHover={{ y: -6 }}>
            <span className="lp-feature-ico">
              <CreditCard size={22} />
            </span>
            <h3>Virtual cards</h3>
            <p>Issue Visa, Mastercard or Verve in a tap. Freeze it with a switch.</p>
            <motion.div className="lp-vcard" whileHover={reduce ? {} : { rotateY: 8, rotateX: -6 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
              <div className="lp-vcard-top">
                <img src="/logo-mark-dark.svg" alt="" />
                <span>Virtual · Debit</span>
              </div>
              <div className="lp-vcard-num">•••• •••• •••• 4821</div>
              <div className="lp-vcard-bottom">
                <span>DAMMIE OKAFOR</span>
                <span>09/29</span>
              </div>
              <div className="lp-vcard-shine" />
            </motion.div>
          </motion.article>

          {[
            { icon: ShieldCheck, title: 'Bank-grade security', text: 'Rotating sessions, device management and 2FA keep your money yours.' },
            { icon: Bell, title: 'Real-time alerts', text: 'Every credit, debit and login is a notification the moment it happens.' },
            { icon: Smartphone, title: 'Web + mobile', text: 'One account, everywhere. Same wallet on your laptop and in your pocket.' },
            { icon: Sparkles, title: 'Zero fees', text: 'Sending Naira to another LolaPay user costs exactly ₦0. Always.' },
          ].map(({ icon: Icon, title, text }) => (
            <motion.article key={title} className="lp-tile small" variants={fadeUp} whileHover={{ y: -6 }}>
              <span className="lp-feature-ico">
                <Icon size={22} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const HOW_STEPS = [
  {
    n: '01',
    title: 'Create your account',
    text: 'Sign up with email or Google in under a minute. Your account number and ₦5,000 welcome balance are ready instantly.',
    img: '/landing/dami-3-bluefade.jpg',
    tag: 'Welcome bonus · +₦5,000',
    icon: Sparkles,
  },
  {
    n: '02',
    title: 'Add your people',
    text: 'Search by @tag, name or account number and save them as beneficiaries. Star the ones you pay every week.',
    img: '/landing/dami-1-bluefade.jpg',
    tag: '3 beneficiaries added',
    icon: Users,
  },
  {
    n: '03',
    title: 'Send & receive',
    text: 'Type an amount, add a note, hit send. They get a notification before you put your phone down.',
    img: '/landing/dami-2-bluefade.jpg',
    tag: '₦18,500 sent · ₦0 fee',
    icon: Send,
  },
];

function HowItWorks() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % HOW_STEPS.length), 3800);
    return () => clearInterval(id);
  }, [reduce, paused]);
  const step = HOW_STEPS[active] ?? HOW_STEPS[0]!;
  const StepIcon = step.icon;

  return (
    <section id="how" className="lp-section lp-how" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="lp-container lp-how-inner">
        <motion.div className="lp-how-copy" variants={stagger} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.span className="lp-eyebrow" variants={fadeUp}>How it works</motion.span>
          <motion.h2 variants={fadeUp}>From sign-up to first transfer in three steps</motion.h2>
          <div className="lp-steps">
            {HOW_STEPS.map((s, i) => (
              <motion.button
                type="button"
                key={s.n}
                className={`lp-step ${i === active ? 'active' : ''}`}
                variants={fadeUp}
                onClick={() => setActive(i)}
              >
                <span className="lp-step-n">
                  {s.n}
                  {i === active && !reduce && (
                    <svg className="lp-step-ring" viewBox="0 0 44 44">
                      <motion.circle cx="22" cy="22" r="20" key={active} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3.8, ease: 'linear' }} />
                    </svg>
                  )}
                </span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </motion.button>
            ))}
          </div>
          <motion.div variants={fadeUp}>
            <Link to="/register" className="lp-btn primary lg">
              Start sending <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="lp-how-visual" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport} transition={{ duration: 0.7 }}>
          <div className="lp-how-frame">
            <AnimatePresence mode="wait">
              <motion.img
                key={step.img}
                src={step.img}
                alt=""
                className="lp-how-photo"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div key={step.n} className="lp-how-tag" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
                <span className="lp-how-tag-ico">
                  <StepIcon size={16} />
                </span>
                <div>
                  <small>Step {step.n}</small>
                  <strong>{step.tag}</strong>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="lp-how-dots">
              {HOW_STEPS.map((s, i) => (
                <button type="button" key={s.n} className={i === active ? 'on' : ''} onClick={() => setActive(i)} aria-label={`Step ${s.n}`} />
              ))}
            </div>
          </div>
          <motion.div className="lp-receipt" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ delay: 0.4, duration: 0.6 }}>
            <div className="lp-receipt-check">
              <Check size={18} />
            </div>
            <strong>₦18,500 sent</strong>
            <span>to Aunty Bisi Styles · @bisi_styles</span>
            <div className="lp-receipt-meta">
              <span>Ref</span>
              <span>LP-7F3K9Q2M</span>
            </div>
            <div className="lp-receipt-meta">
              <span>Fee</span>
              <span>₦0.00</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const STORIES = [
  { img: '/landing/dami-1-fade.jpg', pink: '/landing/dami-1-pink.jpg', name: 'Dammie', tag: '@dami_lola', quote: 'Sunday tithe, Monday lunch money, Friday hair — all from one app. It just works.', amount: '+₦25,000', label: 'Received from Mum' },
  { img: '/landing/dami-2-fade.jpg', pink: '/landing/dami-2-pink.jpg', name: 'Dammie', tag: '@dami_lola', quote: 'I saved my tailor as a beneficiary once. Now paying her takes two taps.', amount: '−₦18,500', label: 'Sent to Aunty Bisi Styles' },
  { img: '/landing/dami-3-fade.jpg', pink: '/landing/dami-3-pink.jpg', name: 'Dammie', tag: '@dami_lola', quote: 'Heaven sent, but the drip is earthly — and paid for on LolaPay.', amount: '+₦12,000', label: 'Received from Tope' },
];

const FEED = [
  { who: 'Mum → Dammie', amt: '+₦25,000', note: 'For the week ❤️' },
  { who: 'Dammie → Aunty Bisi', amt: '−₦18,500', note: 'Owambe outfit' },
  { who: 'Tope → Dammie', amt: '+₦12,000', note: 'Brunch refund' },
  { who: 'Dammie → Kola', amt: '−₦4,000', note: 'Data 📶' },
  { who: 'Ngozi → Dammie', amt: '+₦50,000', note: 'Happy birthday!' },
  { who: 'Dammie → Church', amt: '−₦10,000', note: 'Tithe' },
];

function StoryCard({ s }: { s: (typeof STORIES)[number] }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useTransform(y, [0, 1], [8, -8]);
  const rotateY = useTransform(x, [0, 1], [-8, 8]);
  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    x.set(0.5);
    y.set(0.5);
  };
  return (
    <motion.figure
      className="lp-story"
      variants={fadeUp}
      style={reduce ? {} : { rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ scale: 1.02 }}
    >
      <img src={s.img} alt={s.name} loading="lazy" className="lp-story-img" />
      <img src={s.pink} alt="" loading="lazy" className="lp-story-img pink" />
      <div className="lp-story-badge">
        <span className={s.amount.startsWith('+') ? 'in' : 'out'}>{s.amount}</span>
        <small>{s.label}</small>
      </div>
      <figcaption>
        <p>“{s.quote}”</p>
        <strong>
          {s.name} <span>{s.tag}</span>
        </strong>
      </figcaption>
    </motion.figure>
  );
}

function Stories() {
  const feed = [...FEED, ...FEED];
  return (
    <section id="stories" className="lp-section lp-stories-section">
      <div className="lp-container">
        <motion.div className="lp-section-head" variants={stagger} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.span className="lp-eyebrow" variants={fadeUp}>Real people, real transfers</motion.span>
          <motion.h2 variants={fadeUp}>Made for the moments that matter</motion.h2>
          <motion.p variants={fadeUp}>Sunday services, owambe outfits, lunch with friends — LolaPay is there for all of it.</motion.p>
        </motion.div>
        <motion.div className="lp-stories" variants={stagger} initial="hidden" whileInView="show" viewport={viewport}>
          {STORIES.map((s, i) => (
            <StoryCard key={i} s={s} />
          ))}
        </motion.div>
      </div>
      <div className="lp-feed" aria-hidden>
        <div className="lp-feed-track">
          {feed.map((f, i) => (
            <span key={i} className="lp-feed-item">
              <span className={`lp-feed-dot ${f.amt.startsWith('+') ? 'in' : 'out'}`} />
              <strong>{f.who}</strong>
              <em className={f.amt.startsWith('+') ? 'in' : 'out'}>{f.amt}</em>
              <small>{f.note}</small>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function LedgerDemo() {
  const reduce = useReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setK((n) => n + 1), 3000);
    return () => clearInterval(id);
  }, [reduce]);
  const rows = [
    { who: 'Dammie', kind: 'DEBIT', amt: '−₦18,500', bal: '₦229,850.00' },
    { who: 'Aunty Bisi', kind: 'CREDIT', amt: '+₦18,500', bal: '₦74,300.00' },
  ];
  return (
    <div className="lp-ledger">
      <div className="lp-ledger-head">
        <span className="lp-ledger-lock">
          <Lock size={14} />
        </span>
        <strong>Ledger · transfer LP-7F3K9Q2M</strong>
        <span className="lp-ledger-tx">BEGIN … COMMIT</span>
      </div>
      <div className="lp-ledger-cols">
        <span>Account</span>
        <span>Entry</span>
        <span>Amount</span>
        <span>Balance after</span>
      </div>
      <AnimatePresence mode="popLayout">
        {rows.map((r, i) => (
          <motion.div
            key={`${k}-${r.kind}`}
            className="lp-ledger-row"
            initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span>{r.who}</span>
            <span className={`lp-ledger-kind ${r.kind.toLowerCase()}`}>{r.kind}</span>
            <span className={r.kind === 'DEBIT' ? 'out' : 'in'}>{r.amt}</span>
            <span>{r.bal}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div className="lp-ledger-sum" key={`sum-${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <Check size={14} /> Debits = Credits · nothing created, nothing lost
      </motion.div>
    </div>
  );
}

function Security() {
  const reduce = useReducedMotion();
  const items = [
    { icon: Lock, title: 'Encrypted end to end', text: 'TLS in transit, hashed credentials at rest, short-lived access tokens that rotate.' },
    { icon: Fingerprint, title: 'Two-factor sign-in', text: 'Turn on 2FA and approve every new device from Security settings.' },
    { icon: ShieldCheck, title: 'Session control', text: 'See every device logged into your account and sign them out with one tap.' },
    { icon: Bell, title: 'Login alerts', text: 'A new device signs in? You know before they see your balance.' },
  ];
  return (
    <section id="security" className="lp-section lp-security">
      <div className="lp-blob c" />
      <img src="/landing/collage-duo.jpg" alt="" className="lp-security-bg" />
      <div className="lp-container lp-security-inner">
        <motion.div className="lp-security-copy" variants={stagger} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.span className="lp-eyebrow light" variants={fadeUp}>Security</motion.span>
          <motion.h2 variants={fadeUp}>Your money, locked down.</motion.h2>
          <motion.p variants={fadeUp}>
            Every transfer is a double-entry ledger write inside a single database transaction — balances can never drift, and every kobo is
            traceable.
          </motion.p>
          <motion.div className="lp-security-grid" variants={stagger}>
            {items.map(({ icon: Icon, title, text }) => (
              <motion.div key={title} className="lp-security-card" variants={fadeUp} whileHover={{ y: -4 }}>
                <Icon size={20} />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div className="lp-security-visual" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: 0.7 }}>
          <motion.div className="lp-shield" animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <ShieldCheck size={26} />
          </motion.div>
          <LedgerDemo />
          <div className="lp-security-photo">
            <img src="/landing/dami-3-duo.jpg" alt="" />
            <div>
              <strong>“I sleep well.”</strong>
              <small>Dammie · verified 2FA user</small>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <motion.div className="lp-final" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewport} transition={{ duration: 0.6 }}>
          <img src="/logo-mark-dark.svg" alt="" className="lp-final-logo" />
          <h2>Ready to send your first ₦?</h2>
          <p>Open a free LolaPay account and get a ₦5,000 welcome balance to try it out.</p>
          <div className="lp-cta-row center">
            <Link to="/register" className="lp-btn white lg">
              Create free account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="lp-btn ghost-light lg">
              Log in
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container lp-footer-inner">
        <div>
          <Brand />
          <p>Send · Receive · Thrive</p>
        </div>
        <div className="lp-footer-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#security">Security</a>
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
        </div>
        <small>© {new Date().getFullYear()} LolaPay. Built for the Abbey FullStack Engineer Challenge.</small>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="lp">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Stats />
        <Features />
        <HowItWorks />
        <Stories />
        <Security />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
