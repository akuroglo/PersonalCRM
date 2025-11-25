import { ContactForm } from "../ContactForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContactFormExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 bg-background">
      <Button onClick={() => setOpen(true)}>Открыть форму</Button>
      <ContactForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log("Submit", data);
          setOpen(false);
        }}
      />
    </div>
  );
}
