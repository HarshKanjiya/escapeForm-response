import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";

const HeroSection = () => {
    return (
        <section
            className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-16"
            aria-labelledby="hero-heading"
        >
            {/* Subtle background */}
            <div className="absolute inset-0 gradient-radial" aria-hidden="true" />
            <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden="true" />

            <div className="container relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-in">
                        <span className="badge-beta">
                            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                                <span className="animate-pulse-soft absolute inline-flex h-full w-full rounded-full bg-primary"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                            </span>
                            Beta
                        </span>
                        <span className="badge-coming-soon">
                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                            AI Features Coming Soon
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1
                        id="hero-heading"
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-display font-bold tracking-tight mb-6 animate-fade-in text-balance"
                        style={{ animationDelay: "0.1s" }}
                    >
                        Build forms
                        <br />
                        <span className="text-primary">without the chaos</span>
                    </h1>

                    {/* Subheading */}
                    <p
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed animate-fade-in"
                        style={{ animationDelay: "0.2s" }}
                    >
                        The form builder for developers who value their time.
                        Create accessible forms with drag-and-drop that generates
                        clean, production-ready code.
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in w-full sm:w-auto"
                        style={{ animationDelay: "0.3s" }}
                    >
                        <Button variant="hero" size="xl" className="w-full sm:w-auto">
                            Start Building Free
                            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button variant="hero-secondary" size="xl" className="w-full sm:w-auto">
                            <Play className="mr-1 h-4 w-4" aria-hidden="true" />
                            Watch Demo
                        </Button>
                    </div>

                    {/* Hero Preview - Form Builder Mock */}
                    <div
                        className="relative w-full max-w-4xl animate-fade-in-up"
                        style={{ animationDelay: "0.4s" }}
                        role="img"
                        aria-label="FormFlow editor interface preview showing a drag-and-drop form builder"
                    >
                        {/* Glow effect */}
                        <div
                            className="absolute -inset-4 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl blur-2xl"
                            aria-hidden="true"
                        />

                        <div className="relative rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                            {/* Browser Header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
                                <div className="flex gap-1.5" aria-hidden="true">
                                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-1.5 rounded-md bg-background text-xs text-muted-foreground border border-border font-mono">
                                        formflow.dev/editor
                                    </div>
                                </div>
                            </div>

                            {/* Form Builder UI */}
                            <div className="p-4 md:p-6 bg-background">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    {/* Components Sidebar - Hidden on mobile */}
                                    <div className="hidden md:block md:col-span-3 space-y-2">
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Components</div>
                                        {["Text Input", "Email", "Dropdown", "Checkbox"].map((item) => (
                                            <div
                                                key={item}
                                                className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Canvas */}
                                    <div className="col-span-1 md:col-span-6 min-h-[240px] md:min-h-[280px] rounded-lg border-2 border-dashed border-border p-4 md:p-6 flex flex-col gap-4 bg-muted/20">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-foreground">Full Name</label>
                                            <div className="h-10 rounded-md border border-border bg-background" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-foreground">Email Address</label>
                                            <div className="h-10 rounded-md border border-border bg-background" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-foreground">Message</label>
                                            <div className="h-20 rounded-md border border-border bg-background" />
                                        </div>
                                        <div className="h-10 w-28 rounded-md bg-primary mt-2" />
                                    </div>

                                    {/* Properties Panel - Hidden on mobile */}
                                    <div className="hidden md:block md:col-span-3 space-y-3">
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Properties</div>
                                        <div className="space-y-1.5">
                                            <div className="text-xs text-muted-foreground">Field Label</div>
                                            <div className="h-8 rounded-md border border-border bg-background" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="text-xs text-muted-foreground">Placeholder</div>
                                            <div className="h-8 rounded-md border border-border bg-background" />
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className="w-4 h-4 rounded border-2 border-primary bg-primary/20" />
                                            <span className="text-xs text-foreground">Required field</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-12 md:mt-16 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                        <p className="text-sm text-muted-foreground mb-4">Trusted by developers at</p>
                        <div
                            className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
                            role="list"
                            aria-label="Companies using FormFlow"
                        >
                            {["Vercel", "Stripe", "Linear", "Notion", "Figma"].map((company) => (
                                <span
                                    key={company}
                                    className="text-base md:text-lg font-semibold text-muted-foreground/60"
                                    role="listitem"
                                >
                                    {company}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
