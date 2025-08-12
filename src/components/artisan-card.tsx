import Link from 'next/link';
import Image from 'next/image';
import type { Artisan } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <Card className="overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl text-center">
      <CardHeader className="p-0 items-center">
        <div className="relative w-32 h-32 rounded-full mt-6 border-4 border-background shadow-lg">
          <Image
            src={artisan.profileImage}
            alt={artisan.name}
            fill
            className="object-cover rounded-full"
            data-ai-hint="indian artisan portrait"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-xl font-headline">{artisan.name}</CardTitle>
        <CardDescription className="text-primary mt-1">{artisan.craft}</CardDescription>
        <div className="flex items-center justify-center text-sm text-muted-foreground mt-2">
            <MapPin size={14} className="mr-1" />
            {artisan.location}
        </div>
        <p className="text-muted-foreground mt-4 text-sm line-clamp-3">{artisan.bio}</p>
      </CardContent>
      <CardFooter className="p-4 bg-secondary">
        <Button asChild className="w-full">
          <Link href={`/artisans/${artisan.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
