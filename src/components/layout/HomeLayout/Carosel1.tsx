"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface B2BCarouselProps {
  data: { content: string; alt?: string }[];
  delayTime?: number;
  imageClassName?: string;
  className?: string;
}

export function B2BCarousel({
  data,
  delayTime = 5000,
  imageClassName,
  className,
}: B2BCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: delayTime, stopOnInteraction: true })
  );

  // ফাইলটি ভিডিও কিনা তা চেক করার ফাংশন
  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url) || url.includes("video");
  };

  return (
    <Carousel
      plugins={[plugin.current]}
      className={cn("w-full h-full", className)}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true,
        align: "start",
      }}
    >
      <CarouselContent className="h-full">
        {data.map((item, index) => (
          <CarouselItem key={index} className="h-full">
            <Card className="border-none shadow-none bg-transparent h-full p-0 overflow-hidden">
              <CardContent className="p-0 h-full">
                {isVideo(item.content) ? (
                  <video
                    src={item.content}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={cn(
                      "w-full h-full object-cover rounded-2xl",
                      imageClassName
                    )}
                  />
                ) : (
                  <img
                    src={item.content}
                    alt={item.alt || `SolveX Supply Banner ${index + 1}`}
                    className={cn(
                      "w-full h-full object-contain rounded-2xl",
                      imageClassName
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}