"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const navLinks = [
        { href: "#features", label: "Features" },
        { href: "#how-it-works", label: "How it works" },
        { href: "#pricing", label: "Pricing" },
    ];

    return (
        <header
            role="banner"
            className={` fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/20 backdrop-blur-2xl border-b border-border`}
        >
            <nav
                className="container flex h-16 items-center justify-between max-w-7xl mx-auto"
                role="navigation"
                aria-label="Main navigation"
            >
                <a
                    href="/"
                    className="flex items-center gap-2.5 font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
                    aria-label="FormFlow - Home"
                >
                    <div className="flex items-center justify-center rounded-xl overflow-hidden corner-squircle bg-foreground" aria-hidden="true">
                        <Image src="logo-light.svg" alt="" width={32} height={32} className="p-0" />
                    </div>
                    <span className="hidden sm:inline text-lg">Escape Form</span>
                    <span className="badge-beta ml-1" aria-label="Beta version">Beta</span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8" role="menubar">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="nav-link"
                            role="menuitem"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Button variant="ghost" size="sm">
                        Sign in
                    </Button>
                    <Button variant="default" size="sm">
                        Get Started
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                >
                    {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                role="menu"
                aria-hidden={!isMobileMenuOpen}
            >
                <div className="glass border-t border-border">
                    <div className="container py-4 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="nav-link py-3 px-2 rounded-md hover:bg-accent"
                                role="menuitem"
                                tabIndex={isMobileMenuOpen ? 0 : -1}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <hr className="border-border my-2" aria-hidden="true" />
                        <Button
                            variant="ghost"
                            className="justify-start"
                            tabIndex={isMobileMenuOpen ? 0 : -1}
                        >
                            Sign in
                        </Button>
                        <Button
                            variant="default"
                            tabIndex={isMobileMenuOpen ? 0 : -1}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
