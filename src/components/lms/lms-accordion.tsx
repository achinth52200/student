
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Subject } from "@/lib/types";
import { ModuleContent } from "./module-content";

type LmsAccordionProps = {
    subjects: Subject[];
}

export function LmsAccordion({ subjects }: LmsAccordionProps) {
    return (
        <Accordion type="multiple" className="w-full space-y-4">
            {subjects.map(subject => (
                <AccordionItem key={subject.id} value={subject.id} className="border-none">
                     <AccordionTrigger className="bg-card glass-effect px-4 py-3 rounded-lg text-lg font-semibold hover:no-underline">
                        {subject.title}
                    </AccordionTrigger>
                     <AccordionContent className="pt-2">
                        <div className="space-y-2 pl-4">
                        {subject.modules.map(module => (
                            <ModuleContent key={module.id} module={module} />
                        ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
