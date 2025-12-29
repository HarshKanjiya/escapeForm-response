import {
    MousePointer2,
    Webhook,
    BarChart3,
    Code2,
    Shield,
    Zap,
    Sparkles,
    Layers
} from "lucide-react";

const features = [
    {
        icon: MousePointer2,
        title: "Drag & Drop Builder",
        description: "Visual editor that makes form creation feel effortless. No code required to get started.",
        span: "col-span-1 md:col-span-2",
    },
    {
        icon: Webhook,
        title: "Webhooks & Integrations",
        description: "Connect to Zapier, Make, or your own API endpoints.",
        span: "col-span-1",
    },
    {
        icon: BarChart3,
        title: "Real-time Analytics",
        description: "Track submissions and conversion rates with built-in analytics.",
        span: "col-span-1",
    },
    {
        icon: Code2,
        title: "Export Clean Code",
        description: "Generate React, Vue, or vanilla HTML that's production-ready.",
        span: "col-span-1 md:col-span-2",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "SOC 2 compliant with encryption and GDPR support.",
        span: "col-span-1",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Optimized for performance with lazy loading.",
        span: "col-span-1",
    },
    {
        icon: Sparkles,
        title: "AI Form Generation",
        description: "Describe your form in plain English and let AI build it for you.",
        span: "col-span-1 md:col-span-2",
        comingSoon: true,
    },
    {
        icon: Layers,
        title: "Version Control",
        description: "Track changes, rollback anytime, and collaborate with your team.",
        span: "col-span-1",
    },
];

const FeaturesSection = () => {
    return (
        <section
            id="features"
            className="py-20 md:py-28 relative"
            aria-labelledby="features-heading"
        >
            <div className="absolute inset-0 gradient-radial opacity-50" aria-hidden="true" />

            <div className="container relative z-10 px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Features</p>
                    <h2 id="features-heading" className="section-heading text-3xl md:text-4xl lg:text-5xl mb-5">
                        Everything you need to build forms
                    </h2>
                    <p className="section-subheading mx-auto">
                        A complete toolkit for creating, managing, and analyzing forms.
                        Built for developers who demand quality.
                    </p>
                </div>

                {/* Bento Grid */}
                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
                    role="list"
                    aria-label="Product features"
                >
                    {features.map((feature, index) => (
                        <article
                            key={feature.title}
                            className={`bento-card ${feature.span} animate-fade-in`}
                            style={{ animationDelay: `${index * 0.08}s` }}
                            role="listitem"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                                    aria-hidden="true"
                                >
                                    <feature.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                        {feature.comingSoon && (
                                            <span className="badge-coming-soon text-[10px] py-0.5 px-2">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
