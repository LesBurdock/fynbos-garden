type Props = {
  imageUrl: string | null;
};

export default function HeroCircle({ imageUrl }: Props) {
  return (
    <div className="relative w-full h-full min-h-48">
      <img
        src="/hero-image.png"
        alt="Fynbos garden"
        className="absolute inset-0 w-full h-full md:w-[95%] md:h-[95%] object-cover rounded-2xl overflow-visible md:-top-[15%]"
      />
    </div>
  );
}
