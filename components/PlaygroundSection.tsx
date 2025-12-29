"use client";
import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PlaygroundSection = () => {
    const [copied, setCopied] = useState(false);
    const [fields, setFields] = useState([
        { id: 1, type: "text", label: "Name", placeholder: "Enter your name" },
        { id: 2, type: "email", label: "Email", placeholder: "you@example.com" },
    ]);

    const labelId = useId();
    const placeholderId = useId();

    const addField = () => {
        const newId = Math.max(...fields.map(f => f.id)) + 1;
        setFields([...fields, { id: newId, type: "text", label: "New Field", placeholder: "Enter value" }]);
        toast.success("Field added");
    };

    const removeField = (id: number) => {
        if (fields.length > 1) {
            setFields(fields.filter(f => f.id !== id));
            toast.success("Field removed");
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generateCode());
            setCopied(true);
            toast.success("Code copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy code");
        }
    };

    const generateCode = () => {
        return `<form className="space-y-4">
${fields.map(f => `  <div>
    <label className="text-sm font-medium">${f.label}</label>
    <input 
      type="${f.type}" 
      placeholder="${f.placeholder}"
      className="w-full px-3 py-2 border rounded-md"
    />
  </div>`).join('\n')}
  <button type="submit">Submit</button>
</form>`;
    };

    return (
        <section
            id="how-it-works"
            className="py-20 md:py-28 bg-muted/30"
            aria-labelledby="playground-heading"
        >
            <div className="container px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Interactive Demo</p>
                    <h2 id="playground-heading" className="section-heading text-3xl md:text-4xl lg:text-5xl mb-5">
                        See it in action
                    </h2>
                    <p className="section-subheading mx-auto">
                        Try our mini form builder. Add fields, customize properties,
                        and see the generated code in real-time.
                    </p>
                </div>

                {/* Playground */}
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        {/* Builder Panel */}
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                                <span className="text-sm font-semibold">Form Builder</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={addField}
                                    aria-label="Add new form field"
                                >
                                    <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                                    Add Field
                                </Button>
                            </div>
                            <div
                                className="p-4 space-y-3 min-h-[280px]"
                                role="list"
                                aria-label="Form fields"
                            >
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:border-primary/40 transition-all animate-fade-in focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                                        role="listitem"
                                    >
                                        <GripVertical
                                            className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0"
                                            aria-hidden="true"
                                        />
                                        <div className="flex-1 space-y-2 min-w-0">
                                            <label htmlFor={`${labelId}-${field.id}`} className="sr-only">
                                                Field label
                                            </label>
                                            <input
                                                id={`${labelId}-${field.id}`}
                                                type="text"
                                                value={field.label}
                                                onChange={(e) => {
                                                    const updated = [...fields];
                                                    updated[index].label = e.target.value;
                                                    setFields(updated);
                                                }}
                                                className="w-full text-sm font-medium bg-transparent border-none outline-none focus:ring-0 text-foreground"
                                                aria-label="Field label"
                                            />
                                            <label htmlFor={`${placeholderId}-${field.id}`} className="sr-only">
                                                Field placeholder
                                            </label>
                                            <input
                                                id={`${placeholderId}-${field.id}`}
                                                type="text"
                                                value={field.placeholder}
                                                onChange={(e) => {
                                                    const updated = [...fields];
                                                    updated[index].placeholder = e.target.value;
                                                    setFields(updated);
                                                }}
                                                className="w-full text-xs text-muted-foreground bg-transparent border-none outline-none focus:ring-0"
                                                aria-label="Field placeholder text"
                                            />
                                        </div>
                                        <label htmlFor={`type-${field.id}`} className="sr-only">
                                            Field type
                                        </label>
                                        <select
                                            id={`type-${field.id}`}
                                            value={field.type}
                                            onChange={(e) => {
                                                const updated = [...fields];
                                                updated[index].type = e.target.value;
                                                setFields(updated);
                                            }}
                                            className="text-xs px-2 py-1.5 rounded-md border border-border bg-muted/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 flex-shrink-0"
                                        >
                                            <option value="text">Text</option>
                                            <option value="email">Email</option>
                                            <option value="number">Number</option>
                                            <option value="tel">Phone</option>
                                        </select>
                                        <button
                                            onClick={() => removeField(field.id)}
                                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all rounded-md focus:ring-2 focus:ring-destructive focus:ring-offset-1"
                                            aria-label={`Remove ${field.label} field`}
                                            disabled={fields.length <= 1}
                                        >
                                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Code Preview Panel */}
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                                <span className="text-sm font-semibold">Generated Code</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    aria-label={copied ? "Code copied" : "Copy code to clipboard"}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 mr-1" aria-hidden="true" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-1" aria-hidden="true" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="p-4 min-h-[280px] overflow-auto bg-muted/20">
                                <pre className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
                                    <code>{generateCode()}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlaygroundSection;
