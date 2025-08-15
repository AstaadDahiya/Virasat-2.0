
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
import { Loader2, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addProduct } from "@/services/firebase";
import Image from "next/image";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";


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
  images: z.array(z.instanceof(File)).min(1, { message: "Please upload at least one image." }).max(5, {message: "You can upload a maximum of 5 images."}),
});

export function AddProductForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useData();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        images: [],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
        const currentImages = form.getValues("images");
        const combined = [...currentImages, ...files];
        if (combined.length > 5) {
            toast({
                variant: "destructive",
                title: "Too many images",
                description: "You can upload a maximum of 5 images.",
            });
            return;
        }
        form.setValue("images", combined, { shouldValidate: true });
        const newPreviews = combined.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages, { shouldValidate: true });

    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to add a product." });
        setLoading(false);
        return;
    }
    
    try {
        const { images, ...productInfo } = values;
        
        const productData = {
            ...productInfo,
            materials: values.materials.split(',').map(m => m.trim()),
            materials_hi: values.materials_hi.split(',').map(m => m.trim()),
        };

        await addProduct(productData, images, user.uid);
        
        toast({
            title: t('toastProductAddedTitle'),
            description: t('toastProductAddedDescription'),
        });
        await refreshData();
        router.push('/dashboard/products');
    } catch(error) {
        console.error("Failed to add product:", error);
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
    } finally {
        setLoading(false);
    }
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
        
         <FormField
            control={form.control}
            name="images"
            render={() => (
                <FormItem>
                    <FormLabel>{t('productImages')}</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading || previews.length >= 5}
                            >
                                <Upload className="mr-2" /> {t('uploadImage')}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {previews.map((src, index) => (
                    <div key={index} className="relative">
                        <Image
                            src={src}
                            alt={`Preview ${index + 1}`}
                            width={150}
                            height={150}
                            className="w-full h-auto aspect-square object-cover rounded-md"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removeImage(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        )}

        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? t('savingProduct') : t('saveProduct')}
        </Button>
      </form>
    </Form>
  );
}
