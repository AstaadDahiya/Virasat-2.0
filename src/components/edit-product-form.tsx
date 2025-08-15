
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
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProduct, updateProduct } from "@/services/firebase";
import Image from "next/image";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "./ui/skeleton";


const formSchema = z.object({
  name: z.string().min(3, { message: "English name must be at least 3 characters." }),
  name_hi: z.string().min(3, { message: "Hindi name is required." }),
  description: z.string().min(10, { message: "English description must be at least 10 characters." }),
  description_hi: z.string().min(10, { message: "Hindi description is required." }),
  price: z.coerce.number().min(1, { message: "Price must be at least 1." }),
  stock: z.coerce.number().int().min(0, { message: "Stock can't be negative." }),
  category: z.string().min(2, { message: "English category is required." }),
  category_hi: z.string().min(2, { message: "Hindi category is required." }),
  materials: z.string().min(3, { message: "Please list at least one material." }),
  materials_hi: z.string().min(3, { message: "Please list at least one material in Hindi." }),
  images: z.array(z.union([z.instanceof(File), z.string()])).min(1, { message: "Please upload at least one image." }).max(5, {message: "You can upload a maximum of 5 images."}),
});

type TranslatableField = "name" | "description" | "category" | "materials";

interface EditProductFormProps {
    productId: string;
}

export function EditProductForm({ productId }: EditProductFormProps) {
  const { toast } = useToast();
  const { t, translate: tAI } = useLanguage();
  const router = useRouter();
  const { refreshData } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState<Partial<Record<TranslatableField, boolean>>>({});
  const [dataLoading, setDataLoading] = useState(true);
  const [previews, setPreviews] = useState<string[]>([]);
  const [initialImageUrls, setInitialImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        images: [],
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
        setDataLoading(true);
        try {
            const productData = await getProduct(productId);
            if(productData) {
                form.reset({
                    ...productData,
                    materials: productData.materials.join(', '),
                    materials_hi: productData.materials_hi.join(', '),
                    images: productData.images,
                });
                setPreviews(productData.images);
                setInitialImageUrls(productData.images);
            } else {
                 toast({ variant: "destructive", title: "Product not found", description: "The product you are trying to edit does not exist." });
                 router.push('/dashboard/products');
            }
        } catch(error) {
             toast({ variant: "destructive", title: "Failed to load product", description: error instanceof Error ? error.message : "An unknown error occurred." });
        } finally {
            setDataLoading(false);
        }
    }
    fetchProduct();
  }, [productId, form, toast, router]);

  const handleAutoTranslation = async (field: TranslatableField, sourceLang: 'en' | 'hi') => {
    const sourceFieldName = sourceLang === 'en' ? field : `${field}_hi`;
    const targetFieldName = sourceLang === 'en' ? `${field}_hi` : field;

    const sourceValue = form.getValues(sourceFieldName as any);
    
    if (sourceValue) {
      const toLanguage = sourceLang === 'en' ? 'Hindi' : 'English';
      
      setTranslating(prev => ({ ...prev, [field]: true }));
      try {
        const result = await tAI(sourceValue, toLanguage);
        form.setValue(targetFieldName as any, result, { shouldValidate: true });
      } catch (error) {
        console.error("Translation failed", error);
        toast({ variant: "destructive", title: "Translation failed" });
      } finally {
        setTranslating(prev => ({ ...prev, [field]: false }));
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
        const currentImages = form.getValues("images");
        const combined = [...currentImages, ...files];
        if (combined.length > 5) {
            toast({ variant: "destructive", title: "Too many images", description: "You can upload a maximum of 5 images." });
            return;
        }
        form.setValue("images", combined, { shouldValidate: true });
        
        const newPreviews = combined.map(img => img instanceof File ? URL.createObjectURL(img) : img);
        setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages, { shouldValidate: true });

    const newPreviews = newImages.map(img => img instanceof File ? URL.createObjectURL(img) : img);
    setPreviews(newPreviews);
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to edit a product." });
        setLoading(false);
        return;
    }
    
    try {
        const newImageFiles = values.images.filter(img => img instanceof File) as File[];
        
        const productData = {
            ...values,
            materials: values.materials.split(',').map(m => m.trim()),
            materials_hi: values.materials_hi.split(',').map(m => m.trim()),
        };

        await updateProduct(productId, productData, newImageFiles, initialImageUrls);
        
        toast({
            title: "Product Updated!",
            description: "Your product has been successfully updated.",
        });
        await refreshData();
        router.push('/dashboard/products');
    } catch(error) {
        console.error("Failed to update product:", error);
        toast({
            variant: "destructive",
            title: "Error updating product",
            description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
    } finally {
        setLoading(false);
    }
  }

  if(dataLoading) {
      return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
          </div>
      )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('dashboard.myProducts.name')} (English)</FormLabel>
                    <FormControl><Input placeholder="e.g., Hand-Painted Blue Pottery Vase" {...field} onBlur={() => handleAutoTranslation('name', 'en')} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="name_hi" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2">
                        {t('dashboard.myProducts.name')} (हिंदी)
                        {translating.name && <Loader2 className="h-4 w-4 animate-spin" />}
                    </FormLabel>
                    <FormControl><Input placeholder="उदा., हाथ से पेंट किया हुआ नीला मिट्टी का फूलदान" {...field} onBlur={() => handleAutoTranslation('name', 'hi')} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('dashboard.myProducts.description')} (English)</FormLabel>
                    <FormControl><Textarea placeholder="Describe your product..." {...field} onBlur={() => handleAutoTranslation('description', 'en')} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="description_hi" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2">
                        {t('dashboard.myProducts.description')} (हिंदी)
                        {translating.description && <Loader2 className="h-4 w-4 animate-spin" />}
                    </FormLabel>
                    <FormControl><Textarea placeholder="अपने उत्पाद का वर्णन करें..." {...field} onBlur={() => handleAutoTranslation('description', 'hi')} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('dashboard.tableHeaders.price')}</FormLabel>
                    <FormControl><Input type="number" placeholder="2500" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="stock" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('dashboard.tableHeaders.stock')}</FormLabel>
                    <FormControl><Input type="number" placeholder="15" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('dashboard.tableHeaders.category')} (English)</FormLabel>
                    <FormControl><Input placeholder="e.g., Block-Printing" {...field} onBlur={() => handleAutoTranslation('category', 'en')} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="category_hi" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2">
                        {t('dashboard.tableHeaders.category')} (हिंदी)
                        {translating.category && <Loader2 className="h-4 w-4 animate-spin" />}
                    </FormLabel>
                    <FormControl><Input placeholder="उदा., ब्लॉक-प्रिंटिंग" {...field} onBlur={() => handleAutoTranslation('category', 'hi')} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FormField control={form.control} name="materials" render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('dashboard.myProducts.materials')} (English)</FormLabel>
                    <FormControl><Input placeholder="Cotton Canvas, Natural Dyes" {...field} onBlur={() => handleAutoTranslation('materials', 'en')} /></FormControl>
                     <p className="text-xs text-muted-foreground">Separate materials with a comma.</p>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="materials_hi" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2">
                        {t('dashboard.myProducts.materials')} (हिंदी)
                        {translating.materials && <Loader2 className="h-4 w-4 animate-spin" />}
                    </FormLabel>
                    <FormControl><Input placeholder="कॉटन कैनवास, प्राकृतिक रंग" {...field} onBlur={() => handleAutoTranslation('materials', 'hi')} /></FormControl>
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
                    <FormLabel>{t('dashboard.myProducts.images')}</FormLabel>
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
                                <Upload className="mr-2" /> {t('dashboard.myProducts.uploadImage')}
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
          {loading ? t('common.saving') : t('common.save')}
        </Button>
      </form>
    </Form>
  );
}
