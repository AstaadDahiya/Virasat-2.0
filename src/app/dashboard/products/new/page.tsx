
"use client";

import { AddProductForm } from "@/components/add-product-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { PlusCircle } from "lucide-react";

export default function AddProductPage() {
    const { t } = useLanguage();
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                    <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">{t('dashboard.myProducts.addProduct')}</h1>
                    <p className="text-muted-foreground">{t('dashboard.myProducts.addProductSubtitle')}</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('dashboard.myProducts.productDetails')}</CardTitle>
                    <CardDescription>{t('dashboard.myProducts.detailsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <AddProductForm />
                </CardContent>
            </Card>
        </div>
    );
}
