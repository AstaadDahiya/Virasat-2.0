
"use client";

import { AddProductForm } from "@/components/add-product-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function AddProductPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                    <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
                    <p className="text-muted-foreground">Add a new item to your collection.</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Provide the necessary information for your product.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AddProductForm />
                </CardContent>
            </Card>
        </div>
    );
}
