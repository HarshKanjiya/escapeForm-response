
interface PageProps {
    params: Promise<{ formId: string }>
}

const Page = async ({ params }: PageProps) => {

    const { formId } = await params

    return (
        <div>
            {`Form ID: ${formId}`}
        </div>
    )
}

export default Page