import { Twitter, Github, MessageCircle } from "lucide-react";

const Footer = () => {
    const links = {
        Product: ["Features", "Pricing", "Changelog", "Documentation"],
        Company: ["About", "Blog", "Careers", "Contact"],
        Legal: ["Privacy", "Terms", "Security"],
        Resources: ["Community", "Help Center", "Status"],
    };

    const socialLinks = [
        { name: "Twitter", icon: Twitter, href: "#" },
        { name: "GitHub", icon: Github, href: "#" },
        { name: "Discord", icon: MessageCircle, href: "#" },
    ];

    return (
        <footer
            className="border-t border-border"
            role="contentinfo"
        >
            <div className="container py-12 md:py-16 px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <a
                            href="/"
                            className="flex items-center gap-2.5 font-bold text-foreground mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md w-fit"
                            aria-label="FormFlow - Home"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground" aria-hidden="true">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-4 w-4 text-background"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    aria-hidden="true"
                                >
                                    <rect x="4" y="4" width="6" height="6" rx="1" />
                                    <rect x="14" y="4" width="6" height="6" rx="1" />
                                    <rect x="4" y="14" width="6" height="6" rx="1" />
                                    <rect x="14" y="14" width="6" height="6" rx="1" />
                                </svg>
                            </div>
                            <span>FormFlow</span>
                        </a>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Build forms without the chaos. Currently in beta.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([category, items]) => (
                        <nav key={category} aria-label={`${category} links`}>
                            <h3 className="text-sm font-semibold text-foreground mb-4">{category}</h3>
                            <ul className="space-y-3" role="list">
                                {items.map((item) => (
                                    <li key={item} role="listitem">
                                        <a
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FormFlow. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                aria-label={`Follow us on ${social.name}`}
                            >
                                <social.icon className="h-5 w-5" aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
