import { Form } from '@prisma/client';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { ArrowUpRightIcon, CornerRightUp, FilePlusCornerIcon, MoveUpRightIcon, SquareArrowOutUpRightIcon } from 'lucide-react';

interface FormCompletedProps {
    formConfig: Form;
    onRestart: () => void;
}

const FormCompleted = ({ formConfig, onRestart }: FormCompletedProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Animated Checkmark Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15
                }}
                className="mb-8"
            >
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <motion.svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <motion.path
                            d="M10 24L20 34L38 14"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.svg>
                </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="space-y-3 mb-8"
            >
                <h2 className="text-2xl font-semibold">
                    Hurray! Your response has been recorded
                </h2>
                <p className="text-accent-foreground/60">
                    Thank you for taking the time to fill out this form.
                </p>
            </motion.div>

            {/* Action Button */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className='flex flex-col items-center'
            >
                {formConfig.multipleSubmissions && (

                    <Button
                        size="lg"
                        onClick={onRestart}
                    >
                        Submit another response
                    </Button>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className='flex items-center flex-col mt-12 gap-3'>
                    <a
                        href="https://escform.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size='lg' variant='secondary' className='ring-2 ring-offset-2 ring-border/20 flex items-center gap-3 font-normal hover:scale-[1.03]'>
                            Create your own form
                            <SquareArrowOutUpRightIcon className='h-4 w-4' />
                        </Button>
                    </a>

                    <span className="text-sm text-muted-foreground">
                        it's free & easy
                    </span>
                </motion.div>
            </motion.div>


            {/* adv */}
            <div className='flex flex-col gap-4'>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="hover:scale-105 hover:rotate-1 active:scale-95 transition-transform duration-200"
                >

                </motion.div>

            </div>
        </div>
    )
}

export default FormCompleted