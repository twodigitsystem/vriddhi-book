"use client";

import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/custom-ui/form";
import { ImageIcon } from "lucide-react";
import { UploadDropzone } from "@/utils/uploadthing";

export function MediaSection() {
    const form = useFormContext();
    const images = form.watch("images") || [];

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="bg-rose-50 dark:bg-rose-900/20 px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                    <ImageIcon className="h-5 w-5 text-rose-600" />
                    <h3 className="text-lg font-bold text-foreground">Item Images</h3>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {images.map((img: string, index: number) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square rounded-lg overflow-hidden border"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Item ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = [...images];
                                                        newImages.splice(index, 1);
                                                        field.onChange(newImages);
                                                    }}
                                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <UploadDropzone
                                        endpoint="multipleFileUploader"
                                        onClientUploadComplete={(res) => {
                                            if (res) {
                                                const newImages = res.map((r) => r.url);
                                                field.onChange([...images, ...newImages]);
                                            }
                                        }}
                                        onUploadError={(error: Error) => {
                                            console.error("Upload failed", error);
                                        }}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
