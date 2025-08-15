
"use client";

import { EditProductForm } from "@/components/edit-product-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                    <Edit className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Edit Product</h1>
                    <p className="text-muted-foreground">Make changes to your existing product.</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Provide the necessary information for your product.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EditProductForm productId={id} />
                </CardContent>
            </Card>
        </div>
    );
}
