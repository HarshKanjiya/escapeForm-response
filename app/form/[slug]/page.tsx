import SinglePageForm from "@/components/form/SinglePageForm";
import StapperForm from "@/components/form/StapperForm";
import prisma from "@/lib/prisma";
import { FormPageType } from "@prisma/client";

interface PageProps {
    params: Promise<{ slug: string }>
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
        return <SinglePageForm form={form} />
    } else {
        return <StapperForm form={form} />
    }

}

export default Page