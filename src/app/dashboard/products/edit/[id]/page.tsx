"use client";

import { EditProductForm } from "@/components/edit-product-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditProductPage() {
    const { t } = useLanguage();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                    <Edit className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">{t('edit')} {t('product')}</h1>
                    <p className="text-muted-foreground">{t('editProductSubtitle')}</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('productDetails')}</CardTitle>
                    <CardDescription>{t('productDetailsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <EditProductForm productId={id} />
                </CardContent>
            </Card>
        </div>
    );
}
