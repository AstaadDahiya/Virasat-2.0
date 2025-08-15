
"use client";

import { useData } from "@/context/data-context";
import { Loader2, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function ShipmentsPage() {
  const { shipments, products, loading } = useData();

  const getProductById = (id: string) => products.find(p => p.id === id);

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Shipments</h1>
          <p className="text-muted-foreground">View and manage all your shipments.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Shipments Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">When you book a shipment, it will appear here.</p>
            <Button asChild className="mt-6">
                <Link href="/dashboard/tools/logistics-hub">
                    Go to Logistics Hub
                </Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map(shipment => {
            const product = getProductById(shipment.product_id);
            return (
              <Card key={shipment.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        {product && (
                            <Image 
                                src={product.images[0]} 
                                alt={product.name}
                                width={64}
                                height={64}
                                className="rounded-md aspect-square object-cover"
                            />
                        )}
                        <div>
                             <CardTitle className="text-base line-clamp-2">{product ? product.name : "Product not found"}</CardTitle>
                             <CardDescription>To: {shipment.destination}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm flex-grow">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carrier</span>
                    <span className="font-medium">{shipment.selected_carrier} <Badge variant="secondary" className="ml-1">{shipment.service_type}</Badge></span>
                  </div>
                   <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-medium">₹{shipment.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booked On</span>
                    <span className="font-medium">{new Date(shipment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Separator />
                   <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Tracking Number</p>
                    <p className="font-mono text-xs p-2 bg-muted rounded-md">{shipment.tracking_number}</p>
                  </div>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                        <a href={shipment.shipping_label_url} target="_blank" rel="noopener noreferrer">View Shipping Label</a>
                    </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
