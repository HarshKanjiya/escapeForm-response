import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
    return (
        <section
            className="py-20 md:py-28 relative overflow-hidden"
            aria-labelledby="cta-heading"
        >
            {/* Background */}
            <div className="absolute inset-0 gradient-radial" aria-hidden="true" />
            <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden="true" />

            <div className="container relative z-10 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2
                        id="cta-heading"
                        className="section-heading text-3xl md:text-4xl lg:text-5xl mb-5"
                    >
                        Ready to build better forms?
                    </h2>
                    <p className="section-subheading mx-auto mb-10">
                        Join developers who are already creating
                        accessible forms in minutes, not hours.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button variant="hero" size="xl" className="w-full sm:w-auto">
                            Start Building Free
                            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            No credit card required
                        </p>
                    </div>

                    {/* Stats */}
                    <div
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                        role="list"
                        aria-label="Product statistics"
                    >
                        {[
                            { value: "10K+", label: "Developers" },
                            { value: "500K+", label: "Forms Created" },
                            { value: "99.9%", label: "Uptime" },
                            { value: "4.9/5", label: "Rating" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="text-center"
                                role="listitem"
                            >
                                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
