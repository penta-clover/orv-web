import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/custom-accordion";

interface FAQProps {
    faqData: { question: string; answer: string }[];
}

export default function FAQ(props: FAQProps) {
    const { faqData } = props;
  
    return (
      <div className="flex flex-col w-full">
  
        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="!text-grayscale-300 text-head3 border-b-1px border-grayscale-700"
            >
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="!text-grayscale-500 text-body4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  }
  