"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  generateProductDescription,
  type GenerateProductDescriptionOutput,
} from "@/ai/flows/generate-product-description";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  keywords: z.string().min(10, { message: "Please provide at least 10 characters of details." }),
  style: z.string().optional(),
});

export function DescriptionGeneratorForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateProductDescriptionOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: "",
      style: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await generateProductDescription(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate description. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }
  
  const handleCopy = () => {
    if (result?.description) {
      navigator.clipboard.writeText(result.description);
      toast({
        title: "Copied to clipboard!",
      });
    }
  };


  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Keywords & Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Hand-thrown ceramic mug, earthy brown glaze, comfortable handle, holds 12oz, perfect for coffee or tea..."
                    className="resize-y min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style/Tone (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Elegant, Rustic, Modern, Playful" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate Description"}
          </Button>
        </form>
      </Form>

      {loading && (
        <div className="space-y-2 pt-4">
            <div className="h-4 bg-muted rounded-full w-3/4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded-full w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded-full w-5/6 animate-pulse"></div>
        </div>
      )}

      {result && (
        <div className="pt-4">
          <h3 className="text-lg font-semibold font-headline mb-2">Generated Description:</h3>
          <div className="p-4 rounded-md bg-secondary relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">{result.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
