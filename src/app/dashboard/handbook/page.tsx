
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Settings, PackagePlus, WandSparkles, Mic, Camera, Megaphone, DollarSign, TrendingUp, BarChart2, Ship } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArtisanHandbookPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">The Virasat Artisan Handbook</h1>
                    <p className="text-muted-foreground">Your guide to mastering the platform and growing your business.</p>
                </div>
            </div>

            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>Welcome to the Virasat Family!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>We are thrilled to partner with you to bring your incredible crafts to a global audience. This handbook is your guide to mastering the platform, from setting up your digital storefront to leveraging our powerful AI tools to grow your business.</p>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-headline flex items-center gap-2"><span className="text-primary">Chapter 1:</span> Getting Started - Your First Steps</h2>
                <p className="text-muted-foreground">Your journey on Virasat begins with setting up your unique identity.</p>
                <div className="grid md:grid-cols-1 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Settings size={20}/> Complete Your Profile</CardTitle>
                            <CardDescription>Your profile is your story. Upload a profile picture, write your bio, and share the history of your craft. Use our automatic translation feature to share your story in both English and Hindi effortlessly.</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <Button asChild variant="outline" size="sm"><Link href="/dashboard/settings">Go to Settings</Link></Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><PackagePlus size={20}/> Add Your First Product</CardTitle>
                             <CardDescription>Showcase your creations. Upload high-quality images and write a compelling name and description. Don't worry about translating—just write in your preferred language, and our AI will handle the rest, making your products accessible to a wider audience.</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <Button asChild variant="outline" size="sm"><Link href="/dashboard/products/new">Add a Product</Link></Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-headline flex items-center gap-2"><span className="text-primary">Chapter 2:</span> Supercharge Your Shop with AI Tools</h2>
                <p className="text-muted-foreground">Virasat provides a suite of AI-powered tools designed to save you time and help you sell more. You can find them all under the AI Tools section in your dashboard sidebar.</p>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Mic size={20}/> AI Storyteller</CardTitle>
                            <CardDescription>Transforms your spoken story into a professional product description. Just press "Record," share your product's story, and let the AI write a beautiful description for you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button asChild variant="outline" size="sm"><Link href="/dashboard/tools/description-generator">Try AI Storyteller</Link></Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Camera size={20}/> Visual Enhancer</CardTitle>
                             <CardDescription>Creates realistic lifestyle photos of your products. Upload a clean photo, describe a scene, and the AI will generate a beautiful mockup.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <Button asChild variant="outline" size="sm"><Link href="/dashboard/tools/visual-enhancer">Try Visual Enhancer</Link></Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Megaphone size={20}/> Smart Marketing Suite</CardTitle>
                             <CardDescription>Generates engaging social media posts, email newsletters, and ad copy. Select a product and target audience to get tailored marketing content.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <Button asChild variant="outline" size="sm"><Link href="/dashboard/tools/marketing-suite">Try Marketing Suite</Link></Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><DollarSign size={20}/> AI Pricing Optimizer</CardTitle>
                             <CardDescription>Suggests the best price for your products based on market data. Enter your costs and let the AI recommend a competitive price.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <Button asChild variant="outline" size="sm"><Link href="/dashboard/tools/pricing-optimizer">Try Pricing Optimizer</Link></Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><TrendingUp size={20}/> Trend Harmonizer</CardTitle>
                             <CardDescription>Analyzes current market trends and gives you ideas. Get a report on popular styles, colors, and patterns to adapt while staying true to your art.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <Button asChild variant="outline" size="sm"><Link href="/dashboard/tools/trend-harmonizer">Try Trend Harmonizer</Link></Button>
                        </CardContent>
                    </Card>
                 </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-headline flex items-center gap-2"><span className="text-primary">Chapter 3:</span> Managing Your Business</h2>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><BarChart2 size={20}/> Analytics</CardTitle>
                             <CardDescription>Keep track of your shop’s performance. View your total revenue, see which products are selling best, and understand what your customers love.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <Button asChild variant="outline" size="sm"><Link href="/dashboard/analytics">View Analytics</Link></Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Ship size={20}/> Shipping</CardTitle>
                             <CardDescription>Our AI Logistics Hub takes the guesswork out of shipping. Get expert advice on packaging, find the best carriers, and book shipments with a single click. </CardDescription>
                        </CardHeader>
                         <CardContent>
                             <Button asChild variant="outline" size="sm"><Link href="/dashboard/tools/logistics-hub">Go to Logistics Hub</Link></Button>
                        </CardContent>
                    </Card>
                 </div>
            </div>

             <Card className="bg-secondary/50 text-center">
                <CardHeader>
                    <CardTitle>Welcome Aboard!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>We are committed to your success and believe that by combining your incredible talent with our technology, we can build something truly special.</p>
                </CardContent>
            </Card>
        </div>
    );
}
