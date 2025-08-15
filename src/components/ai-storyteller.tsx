
"use client";

import { useState, useRef, useEffect } from "react";
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
import {
  storyToDescription,
  type StoryToDescriptionOutput,
} from "@/ai/flows/story-to-description";
import { Loader2, Copy, Mic, Square, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  style: z.string().optional(),
});

export function AiStoryteller() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryToDescriptionOutput | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);


  useEffect(() => {
    const getMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setHasMicPermission(false);
      }
    };
    getMicPermission();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      style: "",
    },
  });

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setResult(null);
        setAudioUrl(null);
    } catch (error) {
        console.error("Error starting recording:", error);
        setHasMicPermission(false);
        toast({
            variant: "destructive",
            title: "Microphone Access Denied",
            description: "Please enable microphone access in your browser settings to use this feature.",
        });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const resetRecording = () => {
    setAudioUrl(null);
    setResult(null);
    audioChunksRef.current = [];
    if(mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!audioUrl) {
      toast({
        variant: "destructive",
        title: "No Audio Recorded",
        description: "Please record your story before generating a description.",
      });
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        try {
            const output = await storyToDescription({
              audioStory: base64Audio,
              style: values.style,
            });
            setResult(output);
        } catch(error) {
             console.error(error);
             toast({
                variant: "destructive",
                title: "Error",
                description: "An unknown error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
      };

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not process audio. Please try recording again.",
      });
      setLoading(false);
    }
  }
  
  const handleCopy = () => {
    if (result?.description) {
      navigator.clipboard.writeText(result.description);
      toast({
        title: "Copied to clipboard!",
      });
    }
  };

  if (hasMicPermission === false) {
      return (
           <Alert variant="destructive">
              <AlertTitle>Microphone Access Required</AlertTitle>
              <AlertDescription>
                Please enable microphone access in your browser settings to use this feature.
              </AlertDescription>
            </Alert>
      )
  }
   if (hasMicPermission === null) {
      return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin"/>
            <p className="ml-2">Checking for microphone...</p>
        </div>
      )
  }


  return (
    <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
            <Button 
                type="button"
                onClick={isRecording ? stopRecording : startRecording} 
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className="w-48"
                disabled={loading}
            >
                {isRecording ? <Square className="mr-2" /> : <Mic className="mr-2" />}
                {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            {audioUrl && !isRecording && (
                <div className="w-full space-y-4 p-4 bg-secondary rounded-lg">
                     <div className="flex items-center justify-between">
                         <h3 className="font-semibold text-sm">Your Voice Note</h3>
                         <Button variant="ghost" size="sm" onClick={resetRecording}>
                             <RotateCw className="mr-2 h-4 w-4"/>
                             Record Again
                         </Button>
                     </div>
                     <audio src={audioUrl} controls className="w-full" />
                </div>
            )}
        </div>


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style/Tone (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Elegant, Rustic, Modern, Poetic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading || !audioUrl || isRecording}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate Description"}
          </Button>
        </form>
      </Form>

      {loading && (
        <div className="space-y-2 pt-4">
            <div className="h-4 bg-muted rounded-full w-3/4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded-full w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded-full w-5/6 animate-pulse"></div>
        </div>
      )}

      {result && (
        <div className="pt-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold font-headline mb-2">Generated Description</h3>
            <div className="p-4 rounded-md bg-secondary relative">
                <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={handleCopy}
                >
                <Copy className="h-4 w-4" />
                </Button>
                <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">{result.description}</p>
            </div>
          </div>
           <div>
            <h3 className="text-lg font-semibold font-headline mb-2">Transcript</h3>
            <div className="p-4 rounded-md bg-muted/50 border">
                <p className="text-muted-foreground leading-relaxed text-sm fst-italic">"{result.transcript}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
