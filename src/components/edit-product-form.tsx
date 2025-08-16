
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
import { Loader2, Upload, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProduct, updateProduct } from "@/services/firebase";
import Image from "next/image";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "./ui/skeleton";


const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().min(1, { message: "Price must be at least 1." }),
  stock: z.coerce.number().int().min(0, { message: "Stock can't be negative." }),
  category: z.string().min(2, { message: "Category is required." }),
  materials: z.string().min(3, { message: "Please list at least one material." }),
  images: z.array(z.union([z.instanceof(File), z.string()])).min(1, { message: "Please upload at least one image." }).max(5, {message: "You can upload a maximum of 5 images."}),
});


interface EditProductFormProps {
    productId: string;
}

export function EditProductForm({ productId }: EditProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { refreshData } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
       <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl><Input placeholder="e.g., Hand-Painted Blue Pottery Vase" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )}/>
        
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl><Textarea placeholder="Describe your product..." {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )}/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                    <FormLabel>Price (INR)</FormLabel>
                    <FormControl><Input type="number" placeholder="2500" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="stock" render={({ field }) => (
                <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl><Input type="number" placeholder="15" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
        </div>
        
        <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl><Input placeholder="e.g., Block-Printing" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )}/>

        <FormField control={form.control} name="materials" render={({ field }) => (
            <FormItem>
                <FormLabel>Materials</FormLabel>
                <FormControl><Input placeholder="Cotton Canvas, Natural Dyes" {...field} /></FormControl>
                 <p className="text-xs text-muted-foreground">Separate materials with a comma.</p>
                <FormMessage />
            </FormItem>
        )}/>
        
         <FormField
            control={form.control}
            name="images"
            render={() => (
                <FormItem>
                    <FormLabel>Product Images</FormLabel>
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
                                <Upload className="mr-2" /> Upload Image
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
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
