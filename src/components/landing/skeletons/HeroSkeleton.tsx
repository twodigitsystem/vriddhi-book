import React from "react";

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column Skeleton */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Badge skeleton */}
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />

              {/* Title skeleton */}
              <div className="space-y-3">
                <div className="w-full h-12 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-12 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="w-full h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-5/6 h-6 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Feature list skeleton */}
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-40 h-12 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-12 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Trust badges skeleton */}
            <div className="flex items-center space-x-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Skeleton - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6">
              <div className="bg-gray-200 rounded-xl p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-32 h-6 bg-gray-300 rounded animate-pulse" />
                    <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-300 rounded-lg p-3 animate-pulse">
                        <div className="w-16 h-8 bg-gray-400 rounded animate-pulse mb-1" />
                        <div className="w-20 h-4 bg-gray-400 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-300 rounded-lg p-3 animate-pulse">
                    <div className="flex justify-between items-center mb-2">
                      <div className="w-20 h-4 bg-gray-400 rounded animate-pulse" />
                      <div className="w-16 h-4 bg-gray-400 rounded animate-pulse" />
                    </div>
                    <div className="h-16 bg-gray-400 rounded flex items-end justify-between px-2">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-500 rounded-t animate-pulse"
                          style={{ height: `${Math.random() * 60 + 20}%`, width: "8px" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards skeleton */}
            <div className="absolute -top-4 -left-4 w-32 h-16 bg-gray-200 rounded-lg animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-32 h-16 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};
