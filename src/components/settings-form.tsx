
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
import { Loader2, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import { getArtisan, updateArtisanProfile } from "@/services/firebase";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  craft: z.string().min(2, "Craft is required"),
  location: z.string().min(2, "Location is required"),
  profileImage: z.any().optional(), // Can be a File object or a URL string
});

export function SettingsForm() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        bio: "",
        craft: "",
        location: "",
    },
  });

  useEffect(() => {
    const fetchArtisan = async () => {
      if (!user) {
        setDataLoading(false);
        return;
      }
      setDataLoading(true);
      try {
        const artisanData = await getArtisan(user.uid);
        if (artisanData) {
            form.reset(artisanData);
            if (artisanData.profileImage) {
              setPreview(artisanData.profileImage);
            }
        }
      } catch (error: any) {
        toast({ variant: 'destructive', title: "Error loading profile", description: error.message });
      } finally {
        setDataLoading(false);
      }
    };
    if (user) {
      fetchArtisan();
    }
  }, [user, form, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("profileImage", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ variant: 'destructive', title: "Error", description: "You must be logged in to update your profile." });
      return;
    };

    setIsSubmitting(true);
    
    try {
      const { profileImage, ...updateData } = values;
      const newImageFile = profileImage instanceof File ? profileImage : undefined;

      await updateArtisanProfile(user.uid, updateData, newImageFile);
      
      toast({ title: "Profile updated successfully!" });

    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error updating profile", description: error.message || "An unexpected error occurred." });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (authLoading || dataLoading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
         <FormField control={form.control} name="profileImage" render={({ field }) => (
            <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <div className="flex items-center gap-4">
                    <Image src={preview || "https://placehold.co/100x100.png"} alt="Profile Preview" width={100} height={100} className="rounded-full aspect-square object-cover" />
                    <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2" /> Upload Image</Button>
                </div>
                <FormMessage />
            </FormItem>
        )}/>
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Artisan Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="bio" render={({ field }) => (
            <FormItem><FormLabel>Bio / Your Story</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="craft" render={({ field }) => (
            <FormItem><FormLabel>Primary Craft/Art Form</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem><FormLabel>Location (City, State)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
