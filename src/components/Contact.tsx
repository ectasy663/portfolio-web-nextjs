'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mail, Linkedin, Github, Send, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.set([titleRef.current, contentRef.current], {
      opacity: 0,
      y: 50
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`Portfolio Contact: ${formData.subject}`);
    const body = encodeURIComponent(
      `Hello Naman,\n\nI found your portfolio and would like to get in touch.\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n\nBest regards,\n${formData.name}`
    );
    const mailtoLink = `mailto:namansingh4680@gmail.com?subject=${subject}&body=${body}`;
    
    window.open(mailtoLink, '_blank');
    
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
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "namansingh4680@gmail.com",
      href: "mailto:namansingh4680@gmail.com"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "/in/naman-singh-panwar7/",
      href: "https://www.linkedin.com/in/naman-singh-panwar7/"
    },
    {
      icon: Github,
      label: "GitHub",
      value: "/ectasy663",
      href: "https://github.com/ectasy663"
    }
  ];

  return (
    <section ref={sectionRef} id="contact" className="section-padding bg-gray-50 dark:bg-transparent relative overflow-hidden transition-colors duration-300">
      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-10 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-20">
        <h2 ref={titleRef} className="text-display-lg font-display text-center mb-16 gradient-text leading-tight py-2">
          Let&apos;s Build Something Amazing
        </h2>

        <div ref={contentRef} className="max-w-6xl mx-auto">
          {/* Intro text */}
          <div className="text-center mb-16">
            <p className="text-body-lg text-gray-600 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.
              Feel free to reach out and let&apos;s create something extraordinary together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-heading-md font-heading mb-6 text-gray-900 dark:text-white">Get In Touch</h3>
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
                    className="flex items-center gap-4 p-4 bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/20 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-300 group shadow-lg hover:shadow-2xl"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-800/60 transition-colors duration-300">
                      <contact.icon className="w-6 h-6 text-primary-600 dark:text-primary-300" />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{contact.label}</p>
                      <p className="text-gray-900 dark:text-white font-medium">{contact.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Quick stats */}
              <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">Response Time</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">&lt; 24h</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Email Response</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">100%</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Reply Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-200">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-600 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
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
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-600 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
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
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-600 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
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
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-600 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <div className="p-4 rounded-lg flex items-center gap-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Opening your email client with a pre-filled message. Please send it to complete your contact request!
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-700 dark:text-gray-400">
            © 2025 Naman Singh Panwar. Built with Next.js, TypeScript, and GSAP.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
