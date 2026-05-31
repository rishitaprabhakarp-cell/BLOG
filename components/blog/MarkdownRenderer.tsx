import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/blog/CodeBlock";
import MermaidDiagram from "@/components/blog/MermaidDiagram";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export default function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={className ?? "prose-blog"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          code({ className: codeClass, children, ...props }) {
            const text = String(children).replace(/\n$/, "");
            const isBlock = codeClass?.includes("language-");
            if (isBlock && codeClass?.includes("language-mermaid")) {
              return <MermaidDiagram chart={text} />;
            }
            if (isBlock) {
              return <CodeBlock className={codeClass}>{text}</CodeBlock>;
            }
            return (
              <code className={codeClass} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
