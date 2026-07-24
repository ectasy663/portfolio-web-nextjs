'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LuMail, LuLinkedin, LuGithub, LuSend, LuCheck, LuSparkles } from 'react-icons/lu';
import { loadGSAP } from '@/utils/gsapLoader';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { useInViewOnce } from '@/hooks/useInViewOnce';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shouldAnimate = useInViewOnce(sectionRef, { rootMargin: '0px', threshold: 0.2 });

  useSplitTextAnimation({
    scopeRef: sectionRef,
    targetRef: titleRef,
    enabled: shouldAnimate,
    desktop: {
      duration: 1,
      stagger: 0.04,
      ease: 'back.out(1.7)',
      from: {
        y: 28
      }
    },
    mobile: {
      duration: 0.9,
      stagger: 0.035,
      ease: 'back.out(1.7)',
      from: {
        y: 20
      }
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!shouldAnimate) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    const controller = new AbortController();

    const init = async () => {
      try {
        const { gsap } = await loadGSAP();
        if (cancelled) return;

        ctx = gsap.context(() => {
          // === INTRO TEXT FADE IN ===
          const introText = contentRef.current?.querySelector('.intro-text');
          if (introText) {
            gsap.fromTo(introText,
              {
                opacity: 0,
                y: 30
              },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
              }
            );
          }

          // === CONTACT INFO CARDS STAGGERED ENTRANCE ===
          const contactCards = contactInfoRef.current?.querySelectorAll('.contact-card');
          if (contactCards) {
            contactCards.forEach((card, index) => {
              gsap.fromTo(card,
                {
                  opacity: 0,
                  x: -30
                },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: "back.out(1.5)"
                }
              );
            });
          }

          // === CONTACT ICONS BOUNCE ===
          const contactIcons = contactInfoRef.current?.querySelectorAll('.contact-icon');
          contactIcons?.forEach((icon, index) => {
            gsap.to(icon, {
              y: -5,
              duration: 1 + index * 0.2,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.3
            });
          });

          // === RESPONSE TIME STATS COUNTER ===
          const responseStats = contactInfoRef.current?.querySelectorAll('.response-stat');
          if (responseStats) {
            responseStats.forEach((stat, index) => {
              gsap.fromTo(stat,
                {
                  opacity: 0,
                  scale: 0.5
                },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  delay: 0.3 + index * 0.1,
                  ease: "back.out(2)"
                }
              );
            });
          }

          // === FORM CONTAINER OPTIMIZED ENTRANCE ===
          const formContainer = formRef.current?.closest('.form-container');
          if (formContainer) {
            gsap.fromTo(formContainer,
              {
                opacity: 0,
                x: 30
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out"
              }
            );
          }

          // === FORM INPUTS FOCUS ANIMATION ===
          const formInputs = formRef.current?.querySelectorAll('input, textarea');
          formInputs?.forEach((input) => {
            input.addEventListener('focus', () => {
              gsap.to(input, {
                scale: 1.02,
                borderColor: 'rgba(59, 130, 246, 0.5)',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
                duration: 0.3,
                ease: "power2.out"
              });
            }, { signal: controller.signal });

            input.addEventListener('blur', () => {
              gsap.to(input, {
                scale: 1,
                borderColor: '',
                boxShadow: 'none',
                duration: 0.3,
                ease: "power2.out"
              });
            }, { signal: controller.signal });
          });

          // === SUBMIT BUTTON HOVER EFFECT ===
          const submitBtn = formRef.current?.querySelector('.submit-btn');
          if (submitBtn) {
            submitBtn.addEventListener('mouseenter', () => {
              gsap.to(submitBtn, {
                scale: 1.05,
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)',
                duration: 0.3,
                ease: "power2.out"
              });

              const icon = submitBtn.querySelector('.btn-icon');
              if (icon) {
                gsap.to(icon, {
                  x: 5,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }
            }, { signal: controller.signal });

            submitBtn.addEventListener('mouseleave', () => {
              gsap.to(submitBtn, {
                scale: 1,
                boxShadow: '',
                duration: 0.3,
                ease: "power2.out"
              });

              const icon = submitBtn.querySelector('.btn-icon');
              if (icon) {
                gsap.to(icon, {
                  x: 0,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }
            }, { signal: controller.signal });
          }

          // === FOOTER ENTRANCE ===
          const footer = sectionRef.current?.querySelector('.footer-section');
          if (footer) {
            gsap.set(footer, {
              opacity: 0,
              y: 30
            });

            gsap.to(footer, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            });
          }

          // === BACKGROUND PARALLAX ===
          const overlays = sectionRef.current?.querySelectorAll('.contact-overlay');
          overlays?.forEach((el, i) => {
            gsap.to(el, {
              y: i % 2 === 0 ? -20 : -10,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          });

        }, sectionRef);
      } catch (error) {
        console.error('Failed to initialize Contact animations:', error);
      }
    };

    init();

    return () => {
      cancelled = true;
      controller.abort();
      ctx?.revert();
    };
  }, [shouldAnimate]);

  // === SUCCESS ANIMATION ===
  useEffect(() => {
    if (!showSuccess || !formRef.current) return;

    let cancelled = false;

    const run = async () => {
      try {
        const { gsap } = await loadGSAP();
        if (cancelled || !formRef.current) return;

        const particles = 20;
        const container = formRef.current.closest('.form-container');
        if (!container) return;

        for (let i = 0; i < particles; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-2 h-2 rounded-full pointer-events-none';
          particle.style.background = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)];
          particle.style.left = '50%';
          particle.style.top = '50%';
          container.appendChild(particle);

          gsap.to(particle, {
            x: gsap.utils.random(-200, 200),
            y: gsap.utils.random(-200, 200),
            opacity: 0,
            scale: gsap.utils.random(0.5, 2),
            duration: 1,
            ease: "power2.out",
            onComplete: () => particle.remove()
          });
        }
      } catch (error) {
        console.error('Failed to run success animation:', error);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [showSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setShowSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: LuMail,
      label: "Email",
      value: "namansingh4680@gmail.com",
      href: "mailto:namansingh4680@gmail.com"
    },
    {
      icon: LuLinkedin,
      label: "LinkedIn",
      value: "/in/naman-singh-panwar7/",
      href: "https://www.linkedin.com/in/naman-singh-panwar7/"
    },
    {
      icon: LuGithub,
      label: "GitHub",
      value: "/ectasy663",
      href: "https://github.com/ectasy663"
    }
  ];

  return (
    <section ref={sectionRef} id="contact" className="section-padding bg-gray-50 dark:bg-transparent relative overflow-hidden transition-colors duration-300 scroll-mt-28" aria-labelledby="contact-title">
      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-10 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="contact-overlay absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl"></div>
        <div className="contact-overlay absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-20">
        <h2
          ref={titleRef}
          className="text-5xl xs:text-6xl sm:text-6xl md:text-7xl font-display font-normal text-center mb-16 gradient-text-gold leading-[1.2] pt-2 pb-5 overflow-visible"
          style={{ opacity: 0 }}
        >
          Let&apos;s Build Something Amazing
        </h2>

        <div ref={contentRef} className="max-w-6xl mx-auto">
          {/* Intro text */}
          <div className="text-center mb-16">
            <p className="intro-text text-body-lg text-gray-600 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed flex items-center justify-center gap-2 flex-wrap">
              <LuSparkles className="text-yellow-500" />
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.
              Feel free to reach out and let&apos;s create something extraordinary together.
              <LuSparkles className="text-yellow-500" />
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div ref={contactInfoRef} className="space-y-8">
              <div>
                <h3 id="contact-title" className="text-2xl font-body font-medium mb-6 text-gray-900 dark:text-white">Get In Touch</h3>
                <p className="text-body-md text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Whether you have a project in mind, want to collaborate, or just want to say hello,
                  I&apos;d love to hear from you. Let&apos;s discuss how we can work together.
                </p>
              </div>

              {/* Contact methods */}
              <div className="space-y-6">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-card flex items-center gap-4 p-4 bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl rounded-xl border border-primary-200/50 dark:border-primary-500/30 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-300 group shadow-lg hover:shadow-royal-gold"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="contact-icon flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-800/60 transition-colors duration-300">
                      <contact.icon className="w-6 h-6 text-primary-600 dark:text-primary-300" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{contact.label}</p>
                      <p className="text-gray-900 dark:text-white font-medium">{contact.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Quick stats */}
              <div className="bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-200/50 dark:border-primary-500/30 shadow-lg hover:shadow-royal-gold transition-all duration-300">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">Response Time</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="response-stat text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-gold">&lt; 24h</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Email Response</p>
                  </div>
                  <div className="response-stat text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-gold">100%</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Reply Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="form-container bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl p-8 rounded-xl border border-primary-200/50 dark:border-primary-500/30 shadow-lg hover:shadow-royal-gold transition-all duration-300 relative overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
              <h3 className="text-3xl font-body font-medium mb-6 text-gray-900 dark:text-gray-200">Send a Message</h3>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-900 border border-gray-300 dark:border-primary-500/20 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      suppressHydrationWarning={true}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-900 border border-gray-300 dark:border-primary-500/20 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-900 border border-gray-300 dark:border-primary-500/20 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                    placeholder="Project Collaboration"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-900 border border-gray-300 dark:border-primary-500/20 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                {/* Success/Error Message */}
                {showSuccess && (
                  <div className="p-4 rounded-lg flex items-center gap-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                    <LuCheck className="text-green-600 dark:text-green-400" size={20} aria-hidden="true" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Message sent successfully! I&apos;ll get back to you soon.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-lg flex items-center gap-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn w-full btn-primary flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-3 rounded-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <LuSend size={20} className="btn-icon" aria-hidden="true" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-section mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-700 dark:text-gray-400">
            © 2025 Naman Singh Panwar. Built with Next.js, TypeScript, and GSAP.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
