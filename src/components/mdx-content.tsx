import { renderMarkdown } from "@/lib/markdown";

interface MdxContentProps {
  content: string;
}

/**
 * Renders trusted MDX content from local filesystem files.
 * Content is sourced exclusively from `content/` directory MDX files —
 * never from user input — so dangerouslySetInnerHTML is safe here.
 */
export async function MdxContent({ content }: MdxContentProps) {
  const html = await renderMarkdown(content);

  return (
    <div
      className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none
        [&_table]:block [&_table]:overflow-x-auto [&_pre]:overflow-x-auto
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-code:text-orange-400 prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border prose-pre:rounded-lg
        prose-table:border prose-table:border-border
        prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:bg-secondary
        prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2
        prose-strong:text-foreground
        prose-li:text-muted-foreground
        prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
      // safe: content is from trusted local MDX files only, never user input
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
