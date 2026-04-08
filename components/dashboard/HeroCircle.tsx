'use client';

type Props = {
  imageUrl: string | null;
};

export default function HeroCircle({ imageUrl }: Props) {
  return (
    <div className="flex justify-start pl-2">
      {/* Fixed-size container so circles are always precisely positioned */}
      <div className="relative" style={{ width: 210, height: 220 }}>
        {/* Terracotta circle — bottom-left, peeks behind white */}
        <div
          className="absolute rounded-full bg-terra"
          style={{ width: 120, height: 120, bottom: 0, left: 0, zIndex: 0 }}
        />
        {/* White circle — top-right of container */}
        <div
          className="absolute rounded-full bg-white shadow-md"
          style={{ width: 180, height: 180, top: 0, right: 0, zIndex: 1 }}
        />
        {/* Plant photo — centered over white circle */}
        {imageUrl && (
          <div
            className="absolute rounded-full overflow-hidden"
            style={{ width: 164, height: 164, top: 8, right: 8, zIndex: 2 }}
          >
            <img
              src={imageUrl}
              alt="Featured plant"
              className="w-full h-full object-cover"
              onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
