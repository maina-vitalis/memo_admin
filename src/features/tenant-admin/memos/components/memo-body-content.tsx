type MemoBodyContentProps = {
  body: string;
  bodyFormat?: "plain" | "html";
};

export function MemoBodyContent({ body, bodyFormat = "plain" }: MemoBodyContentProps) {
  if (bodyFormat === "html") {
    return (
      <div
        className="memo-body-content mt-2 text-sm leading-6 text-foreground [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:mb-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }

  return (
    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
      {body}
    </p>
  );
}
