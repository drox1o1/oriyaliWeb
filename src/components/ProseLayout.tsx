import { ArticleNav } from "@/components/ArticleNav";

export function ProseLayout({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ori-grid ori-grid--article gap-y-0 py-16 md:py-24">
      <ArticleNav />
      <article className="ori-article col-body">
        {eyebrow ? <p className="ori-kicker mb-4">{eyebrow}</p> : null}
        {children}
      </article>
    </div>
  );
}
