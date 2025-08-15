
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
import { Loader2, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Artisan } from "@/lib/types";
import Image from "next/image";
import { getArtisan, updateArtisanProfile } from "@/services/firebase";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  name_hi: z.string().min(2, "Hindi name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  bio_hi: z.string().min(10, "Hindi bio must be at least 10 characters"),
  craft: z.string().min(2, "Craft is required"),
  craft_hi: z.string().min(2, "Hindi craft is required"),
  location: z.string().min(2, "Location is required"),
  location_hi: z.string().min(2, "Hindi location is required"),
  profileImage: z.any().optional(),
});

export function SettingsForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "", name_hi: "",
        bio: "", bio_hi: "",
        craft: "", craft_hi: "",
        location: "", location_hi: "",
    },
  });

  useEffect(() => {
    const fetchArtisan = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const artisanData = await getArtisan(user.uid);
        if (artisanData) {
            setArtisan(artisanData);
            form.reset(artisanData);
            if (artisanData.profileImage) {
            setPreview(artisanData.profileImage);
            }
        }
      } catch (error: any) {
        toast({ variant: 'destructive', title: t('toastErrorTitle'), description: error.message });
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchArtisan();
    }
  }, [user, form, t, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("profileImage", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setLoading(true);
    
    try {
        const newImageFile = values.profileImage instanceof File ? values.profileImage : undefined;
        const { profileImage, ...updateData } = values;

        const newImageUrl = await updateArtisanProfile(user.uid, updateData, newImageFile);
        if(newImageUrl) {
            setPreview(newImageUrl);
        }
        toast({ title: t('toastProfileUpdated') });

    } catch (error: any) {
        toast({ variant: 'destructive', title: t('toastErrorTitle'), description: error.message });
    } finally {
        setLoading(false);
    }
  }
  
  if (authLoading || loading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
         <FormField control={form.control} name="profileImage" render={({ field }) => (
            <FormItem>
                <FormLabel>{t('profilePictureLabel')}</FormLabel>
                <div className="flex items-center gap-4">
                    <Image src={preview || "https://placehold.co/100x100.png"} alt="Profile Preview" width={100} height={100} className="rounded-full aspect-square object-cover" />
                    <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2" /> {t('uploadImage')}</Button>
                </div>
                <FormMessage />
            </FormItem>
        )}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t('artisanNameLabel')} (English)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="name_hi" render={({ field }) => (
                <FormItem><FormLabel>{t('artisanNameLabel')} (हिंदी)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <FormField control={form.control} name="bio" render={({ field }) => (
            <FormItem><FormLabel>{t('bioLabel')} (English)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="bio_hi" render={({ field }) => (
            <FormItem><FormLabel>{t('bioLabel')} (हिंदी)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="craft" render={({ field }) => (
                <FormItem><FormLabel>{t('craftLabel')} (English)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="craft_hi" render={({ field }) => (
                <FormItem><FormLabel>{t('craftLabel')} (हिंदी)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>{t('locationLabel')} (English)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="location_hi" render={({ field }) => (
                <FormItem><FormLabel>{t('locationLabel')} (हिंदी)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? t('updatingProfile') : t('updateProfile')}
        </Button>
      </form>
    </Form>
  );
}
