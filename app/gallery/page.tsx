"use client";

export default function GalleryPage() {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col gap-6 justify-center items-center overflow-hidden px-4">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-4xl font-bold">Gallery</h1>
        <p className="text-muted-foreground">
          Your postcard collection coming soon
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Placeholder for gallery items */}
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No postcards yet</p>
        </div>
      </div>
    </div>
  );
}
