//src\app\(auth)\layout.tsx

import { NotebookText } from "lucide-react";
import Link from "next/link";
import ImageCarousel from "./_components/image-carousel";
import {
  carouselImages,
  carouselTexts,
} from "@/lib/constants/carousel-images";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <NotebookText className="size-4" />
              </div>
              Vriddhi Book
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block h-screen">
          <div className="absolute inset-0">
            <ImageCarousel images={carouselImages} texts={carouselTexts} />
          </div>
        </div>
      </div>
    </main>
  );
}
