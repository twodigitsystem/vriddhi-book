import React from "react";

export function FeaturesSkeleton() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-3/4 h-10 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
          <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              {/* Icon skeleton */}
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse mb-4" />

              {/* Content skeleton */}
              <div className="space-y-3">
                <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Highlights skeleton */}
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-gray-200 rounded-full animate-pulse" />
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Learn more link skeleton */}
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA skeleton */}
        <div className="text-center mt-16">
          <div className="w-64 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-6" />
          <div className="w-48 h-12 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
      </div>
    </section>
  );
};
