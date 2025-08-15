
"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Settings, PackagePlus, WandSparkles, Mic, Camera, Megaphone, DollarSign, TrendingUp, BarChart2, Ship } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HandbookPage() {
    return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 space-y-12 max-w-4xl">
            <div className="text-center">
                <div className="inline-block p-4 bg-secondary rounded-lg mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-headline">Artisan Handbook</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Your guide to success on Virasat. Learn how to set up your shop, use our AI tools, and grow your business.</p>
            </div>

            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>Welcome to Virasat!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>We're thrilled to have you join our community of talented artisans. This handbook is your resource for making the most of our platform. We've built powerful tools to help you showcase your craft, reach new customers, and manage your business with ease.</p>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h2 className="text-3xl font-bold font-headline flex items-center gap-3"><span className="text-primary">Chapter 1:</span> Getting Started</h2>
                <p className="text-muted-foreground">The first steps to launching your artisan shop on Virasat.</p>
                <div className="grid md:grid-cols-1 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Settings size={20}/> Set Up Your Profile</CardTitle>
                            <CardDescription>Your profile is your story. Go to your Dashboard Settings to add your name, bio, craft, location, and a profile picture. This helps customers connect with you and your unique craft.</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><PackagePlus size={20}/> List Your First Product</CardTitle>
                             <CardDescription>Navigate to "My Products" in your dashboard and click "Add Product". Fill in the details, upload beautiful photos, and set your price. Your first listing will be live in minutes!</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-3xl font-bold font-headline flex items-center gap-3"><span className="text-primary">Chapter 2:</span> Using the AI Tools</h2>
                <p className="text-muted-foreground">Leverage our suite of AI-powered tools to enhance your business.</p>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Mic size={20}/> AI Storyteller</CardTitle>
                            <CardDescription>Don't know what to write? Record a voice note about your product, and our AI will turn it into a compelling description.</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Camera size={20}/> Visual Enhancer</CardTitle>
                             <CardDescription>Upload a simple photo of your product, and our AI will generate a professional-looking lifestyle mockup for you.</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Megaphone size={20}/> Marketing Suite</CardTitle>
                             <CardDescription>Generate posts for Instagram, Facebook, and other social platforms with a single click, tailored to your product.</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><DollarSign size={20}/> Pricing Optimizer</CardTitle>
                             <CardDescription>Get smart pricing suggestions based on your costs, effort, and current market trends to maximize your earnings.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><TrendingUp size={20}/> Trend Harmonizer</CardTitle>
                             <CardDescription>Discover how your craft aligns with current market trends and get suggestions without losing your authentic style.</CardDescription>
                        </CardHeader>
                    </Card>
                 </div>
            </div>

            <div className="space-y-6">
                 <h2 className="text-3xl font-bold font-headline flex items-center gap-3"><span className="text-primary">Chapter 3:</span> Managing Your Business</h2>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><BarChart2 size={20}/> Analytics</CardTitle>
                             <CardDescription>Track your sales, revenue, and top-performing products through a simple and clear analytics dashboard.</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Ship size={20}/> Shipping</CardTitle>
                             <CardDescription>Use the Logistics Hub to get AI advice on packaging, insurance, and the best shipping rates for your orders.</CardDescription>
                        </CardHeader>
                    </Card>
                 </div>
            </div>

             <Card className="bg-secondary/50 text-center">
                <CardHeader>
                    <CardTitle>Ready to Join?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>Create your artisan account today and start sharing your craft with the world.</p>
                    <Button asChild size="lg">
                        <Link href="/signup">Create Artisan Account</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
    );
}
