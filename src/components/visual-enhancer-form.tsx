"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  generateLifestyleMockup,
  type GenerateLifestyleMockupOutput,
} from "@/ai/flows/generate-lifestyle-mockup";
import { Loader2, Download, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  productImage: z.any().refine(file => file instanceof File, "Please upload an image."),
  sceneDescription: z.string().min(10, { message: "Please describe the scene in at least 10 characters." }),
});

export function VisualEnhancerForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateLifestyleMockupOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sceneDescription: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("productImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearImage = () => {
      form.resetField("productImage");
      setPreview(null);
      setResult(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(values.productImage);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        try {
            const output = await generateLifestyleMockup({
              productImage: base64Image,
              sceneDescription: values.sceneDescription,
            });
            setResult(output);
        } catch(error) {
             console.error(error);
             toast({
                variant: "destructive",
                title: "An error occurred",
                description: "Failed to generate mockup. Please try again.",
            });
        } finally {
            setLoading(false);
        }
      };
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to process image. Please try again.",
      });
      setLoading(false);
    }
  }
  
  const handleDownload = () => {
    if (result?.mockupImage) {
      const link = document.createElement('a');
      link.href = result.mockupImage;
      link.download = 'lifestyle-mockup.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="productImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                    <div>
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!!preview}
                        >
                            <Upload className="mr-2" /> Upload Image
                        </Button>
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {preview && (
            <div className="relative w-full max-w-sm p-2 border rounded-md">
              <Image src={preview} alt="Product preview" width={400} height={400} className="rounded-md" />
              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={clearImage}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          <FormField
            control={form.control}
            name="sceneDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scene Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A handmade quilt on a bed in a modern, sunlit bedroom."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading || !form.formState.isValid}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate Mockup"}
          </Button>
        </form>
      </Form>

      {loading && (
        <div className="pt-4 flex flex-col items-center justify-center space-y-4">
            <div className="w-full aspect-square bg-muted rounded-lg animate-pulse"></div>
            <p className="text-muted-foreground">Generating your beautiful mockup... this may take a moment.</p>
        </div>
      )}

      {result?.mockupImage && (
        <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold font-headline">Generated Mockup:</h3>
                <Button onClick={handleDownload} variant="outline">
                    <Download className="mr-2" />
                    Download
                </Button>
            </div>
            <div className="p-2 border rounded-md inline-block">
                 <Image src={result.mockupImage} alt="Generated lifestyle mockup" width={512} height={512} className="rounded-md" />
            </div>
        </div>
      )}
    </div>
  );
}
