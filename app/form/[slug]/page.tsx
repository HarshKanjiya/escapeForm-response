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
            questions: true,
            edges: true
        }
    });

    if (!form) {
        return <div>Form not found</div>
    }

    if (form.formPageType === FormPageType.SINGLE) {
        // @ts-expect-error TS2322
        return <SinglePageForm form={form} />
    } else {
        // @ts-expect-error TS2322
        return <StapperForm form={form} />
    }

}

export default Page