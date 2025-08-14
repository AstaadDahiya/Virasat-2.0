"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  name: z.string().min(3, { message: "English name must be at least 3 characters." }),
  name_hi: z.string().min(3, { message: "Hindi name must be at least 3 characters." }),
  description: z.string().min(10, { message: "English description must be at least 10 characters." }),
  description_hi: z.string().min(10, { message: "Hindi description must be at least 10 characters." }),
  price: z.coerce.number().min(1, { message: "Price must be at least 1." }),
  stock: z.coerce.number().int().min(0, { message: "Stock can't be negative." }),
  category: z.string().min(2, { message: "English category is required." }),
  category_hi: z.string().min(2, { message: "Hindi category is required." }),
  materials: z.string().min(3, { message: "Please list at least one material." }),
  materials_hi: z.string().min(3, { message: "Please list at least one material in Hindi." }),
});

export function AddProductForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        name_hi: "",
        description: "",
        description_hi: "",
        price: 0,
        stock: 0,
        category: "",
        category_hi: "",
        materials: "",
        materials_hi: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    // In a real application, you would send this data to your server/API
    // to create a new product in the database.
    console.log("New Product Data:", values);

    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        toast({
            title: t('toastProductAddedTitle'),
            description: t('toastProductAddedDescription'),
        });
        // Redirect back to the products list after successful creation
        router.push('/dashboard/products');
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('productName')} (English)</FormLabel>
                    <FormControl><Input placeholder="e.g., Hand-Painted Blue Pottery Vase" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="name_hi" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('productName')} (हिंदी)</FormLabel>
                    <FormControl><Input placeholder="उदा., हाथ से पेंट किया हुआ नीला मिट्टी का फूलदान" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>
        
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
                <FormLabel>{t('productDescription')} (English)</FormLabel>
                <FormControl><Textarea placeholder="Describe your product..." {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )}/>
        <FormField control={form.control} name="description_hi" render={({ field }) => (
            <FormItem>
                <FormLabel>{t('productDescription')} (हिंदी)</FormLabel>
                <FormControl><Textarea placeholder="अपने उत्पाद का वर्णन करें..." {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )}/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('tableHeaderPrice')}</FormLabel>
                    <FormControl><Input type="number" placeholder="2500" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="stock" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('tableHeaderStock')}</FormLabel>
                    <FormControl><Input type="number" placeholder="15" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('tableHeaderCategory')} (English)</FormLabel>
                    <FormControl><Input placeholder="e.g., Block-Printing" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="category_hi" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('tableHeaderCategory')} (हिंदी)</FormLabel>
                    <FormControl><Input placeholder="उदा., ब्लॉक-प्रिंटिंग" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="materials" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('productMaterials')} (English)</FormLabel>
                    <FormControl><Input placeholder="Cotton Canvas, Natural Dyes" {...field} /></FormControl>
                     <p className="text-xs text-muted-foreground">Separate materials with a comma.</p>
                    <FormMessage />
                </FormItem>
            )}/>
             <FormField control={form.control} name="materials_hi" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('productMaterials')} (हिंदी)</FormLabel>
                    <FormControl><Input placeholder="कॉटन कैनवास, प्राकृतिक रंग" {...field} /></FormControl>
                    <p className="text-xs text-muted-foreground">सामग्री को अल्पविराम से अलग करें।</p>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>
        
        {/* TODO: Image upload functionality */}
        <div>
            <FormLabel>{t('productImages')}</FormLabel>
            <div className="p-4 mt-2 text-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">{t('imageUploadPlaceholder')}</p>
            </div>
        </div>


        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? t('savingProduct') : t('saveProduct')}
        </Button>
      </form>
    </Form>
  );
}
