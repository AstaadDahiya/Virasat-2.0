
"use client";

import { useState } from "react";
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
import { getLogisticsAdvice, saveShipment } from "@/services/firebase";
import {
  type LogisticsOutput,
  type ShippingRate,
} from "@/lib/types";
import { Loader2, Info, FileText, Bot, PackageCheck, ShieldCheck, ShipWheel, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useData } from "@/context/data-context";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { useAuth } from "@/context/auth-context";

const formSchema = z.object({
  productId: z.string({ required_error: "Please select a product." }).min(1, "Please select a product."),
  packageWeightKg: z.coerce.number().min(0.1, { message: "Weight must be at least 0.1 kg." }),
  length: z.coerce.number().min(1, { message: "Length is required." }),
  width: z.coerce.number().min(1, { message: "Width is required." }),
  height: z.coerce.number().min(1, { message: "Height is required." }),
  destination: z.string().min(3, { message: "Destination is required." }),
  declaredValue: z.coerce.number().min(1, { message: "Declared value is required." }),
});

export function LogisticsHubForm() {
  const { toast } = useToast();
  const { products } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [result, setResult] = useState<LogisticsOutput | null>(null);
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      destination: "",
      packageWeightKg: 1,
      declaredValue: 1000,
      length: '' as any,
      width: '' as any,
      height: '' as any,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setFormValues(values);
    try {
      const product = products.find(p => p.id === values.productId);
      if (!product) {
          toast({ variant: "destructive", title: "Product not found" });
          setLoading(false);
          return;
      }
      
      const output = await getLogisticsAdvice({
          productName: product.name,
          productMaterial: product.materials.join(', '),
          packageWeightKg: values.packageWeightKg,
          packageDimensionsCm: {
              length: values.length,
              width: values.width,
              height: values.height,
          },
          destination: values.destination,
          declaredValue: values.declaredValue,
      });
      setResult(output);

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get logistics advice",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleBooking = async (carrier: ShippingRate) => {
    if (!formValues || !result || !user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to book a shipment." });
        return;
    };
    setBooking(true);

    try {
        await saveShipment({
            productId: formValues.productId,
            destination: formValues.destination,
            packageWeightKg: formValues.packageWeightKg,
            packageDimensionsCm: {
                length: formValues.length,
                width: formValues.width,
                height: formValues.height,
            },
            declaredValue: formValues.declaredValue,
            selectedCarrier: carrier,
            aiPackagingAdvice: result.packagingAdvice,
            aiRiskAdvice: result.riskAndInsuranceAdvice,
            aiCarrierChoiceAdvice: result.carrierChoiceAdvice,
            aiHsCode: result.customsAdvice?.hsCode,
            aiCustomsDeclaration: result.customsAdvice?.declarationText,
        }, user.uid);

        toast({
            title: "Shipment Saved!",
            description: `Your shipment with ${carrier.carrier} has been booked and saved.`
        });
        
        form.reset();
        setResult(null);
        setFormValues(null);

    } catch(error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "Could not save shipment.",
        });
    } finally {
        setBooking(false);
    }
  }


  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Shipping Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <FormField control={form.control} name="productId" render={({ field }) => (
                            <FormItem><FormLabel>Product</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger></FormControl><SelectContent><SelectContent>
                                {products.map(product => (
                                    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                                ))}
                            </SelectContent></SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                         <FormField control={form.control} name="destination" render={({ field }) => (
                            <FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="e.g., Mumbai, India or New York, USA" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField control={form.control} name="packageWeightKg" render={({ field }) => (
                            <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="declaredValue" render={({ field }) => (
                            <FormItem><FormLabel>Value (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="lg:col-span-2">
                             <FormLabel>Dimensions (cm)</FormLabel>
                             <div className="flex gap-2">
                                <FormField control={form.control} name="length" render={({ field }) => (
                                    <FormItem className="flex-1"><FormControl><Input type="number" placeholder="L" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="width" render={({ field }) => (
                                    <FormItem className="flex-1"><FormControl><Input type="number" placeholder="W" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="height" render={({ field }) => (
                                    <FormItem className="flex-1"><FormControl><Input type="number" placeholder="H" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                             </div>
                        </div>
                    </div>
                </CardContent>
           </Card>
          
          <Button type="submit" disabled={loading} size="lg">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Getting advice..." : "Get Advice"}
          </Button>
        </form>
      </Form>
      
      {loading && (
        <div className="space-y-4 pt-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground font-semibold">Analyzing shipping data...</p>
        </div>
      )}

      {result && (
        <div className="pt-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> AI Logistics Advisor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-1">
                                <h4 className="font-semibold flex items-center gap-2"><PackageCheck size={16} />Packaging Advice</h4>
                                <p className="text-sm text-muted-foreground">{result.packagingAdvice}</p>
                           </div>
                           <Separator/>
                            <div className="space-y-1">
                                <h4 className="font-semibold flex items-center gap-2"><ShieldCheck size={16} />Risk & Insurance Advice</h4>
                                <p className="text-sm text-muted-foreground">{result.riskAndInsuranceAdvice}</p>
                           </div>
                           <Separator/>
                            <div className="space-y-1">
                                <h4 className="font-semibold flex items-center gap-2"><ShipWheel size={16} />Carrier Choice Advice</h4>
                                <p className="text-sm text-muted-foreground">{result.carrierChoiceAdvice}</p>
                           </div>
                           {result.customsAdvice && (
                               <>
                                <Separator/>
                                <div className="space-y-1">
                                    <h4 className="font-semibold flex items-center gap-2"><FileText size={16} />Customs Advice</h4>
                                    <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">HS Code:</span> {result.customsAdvice.hsCode}</p>
                                    <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Declaration:</span> {result.customsAdvice.declarationText}</p>
                                </div>
                               </>
                           )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                     <h2 className="text-2xl font-bold font-headline">Shipping Options</h2>
                     {result.shippingOptions.map((option: ShippingRate, index: number) => (
                         <Card key={index}>
                            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-primary">{option.carrier}</h3>
                                        <Badge variant="secondary">{option.serviceType}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Est. Delivery: {option.estimatedDeliveryDate}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-2xl font-bold">₹{option.totalCost.toFixed(2)}</p>
                                    {index > 0 && (
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            ₹{(option.totalCost - result.shippingOptions[0].totalCost).toFixed(2)} more than cheapest
                                        </p>
                                    )}
                                </div>
                                <Button className="w-full md:w-auto" disabled={booking} onClick={() => handleBooking(option)}>
                                    {booking ? <Loader2 className="mr-2 animate-spin"/> :  <Bot className="mr-2"/>}
                                    {booking ? "Booking..." : "Book & Save"}
                                </Button>
                            </CardContent>
                         </Card>
                     ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
