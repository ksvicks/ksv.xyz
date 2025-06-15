import React from "react";
import { Separator } from "@/components/ui/separator";
import { Construction } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="max-w-xl mx-auto text-center py-20">
      <Construction className="w-16 h-16 mx-auto mb-6" aria-hidden="true" />
      <h1 className="text-4xl font-bold mb-4">Projects</h1>
      <p className="text-lg text-muted-foreground">
        I&apos;m working on this section. Updates coming soon—stay tuned!
      </p>
      <Separator className="my-10" />
    </div>
  );
}
