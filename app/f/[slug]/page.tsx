import SinglePageForm from "@/components/form/SinglePageForm";
import StapperForm from "@/components/form/StapperForm";
import prisma from "@/lib/prisma";
import { FormPageType } from "@prisma/client";

interface PageProps {
    params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: PageProps) => {

    const { slug } = await params;
    const form = await prisma.form.findFirst({
        where: {
            uniqueSubdomain: slug
        }
    });
    if (!form) {
        return {
            title: "Form not found"
        }
    }
    return {
        title: form.name,
        description: form.description || "Fill out this form"
    }
}

const Page = async ({ params }: PageProps) => {

    const { slug } = await params;

    const form = await prisma.form.findFirst({
        where: {
            uniqueSubdomain: slug
        },
        include: {
            questions: {
                include: {
                    options: true
                }
            },
            edges: true
        }
    });

    if (!form) {
        return <div>Form not found</div>
    }

    return (
        <div className="w-full h-screen py-8 px-6 sm:px-6 lg:px-8">
            {
                // form.formPageType === FormPageType.SINGLE
                false
                    ?
                    // @ts-expect-error TS2322
                    <SinglePageForm form={form} /> :
                    // @ts-expect-error TS2322
                    <StapperForm form={form} />
            }

            {/* <div className="fixed text-muted-foreground bg-white px-4 py-3 bottom-0 right-0 rounded-tl-3xl corner-squircle">
                <span className="text-xs text-accent-foreground/70">Powered by</span> <a href="https://www.escform.com" target="_blank" rel="noreferrer" className="underline text-sm ml-1 underline-offset-2 font-medium">Escape Form</a>
            </div> */}
            <div className="fixed text-muted-foreground w-full px-4 py-3 bottom-0 right-0 left-0 flex items-center justify-center rounded-tl-3xl corner-squircle">
                <span className="text-xs text-accent-foreground/70">Powered by</span> <a href="https://www.escform.com" target="_blank" rel="noreferrer" className="underline text-sm ml-1 underline-offset-2 font-medium">Escape Form</a>
            </div>
        </div>
    )

}

export default Page