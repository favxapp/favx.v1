const images = ['cafe', 'nature', 'style', 'coffee', 'objects', 'places'];

/** Decorative photography, never presented as recommendations or account content. */
export function InspirationGallery({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`inspiration-gallery${compact ? ' inspiration-gallery-compact' : ''}`} aria-hidden="true">
      {images.map((name, index) => (
        <div className="inspiration-photo" key={name}>
          {/* Static, locally hosted assets; no third-party image request. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/images/onboarding/${name}.jpg`} alt="" width={600} height={750} loading={index < 3 ? 'eager' : 'lazy'} />
        </div>
      ))}
    </div>
  );
}
