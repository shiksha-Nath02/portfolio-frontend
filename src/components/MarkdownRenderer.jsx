import ReactMarkdown from "react-markdown";

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <section className="mb-24">
      <ReactMarkdown
        components={{
          h1: (props) => (
            <h1
              className="text-4xl md:text-5xl font-extrabold text-white mt-12 mb-8 tracking-tight"
              {...props}
            />
          ),

          h2: (props) => (
            <h2
              className="text-2xl md:text-3xl font-bold text-slate-100 mt-16 mb-6 border-b border-slate-800 pb-3"
              {...props}
            />
          ),

          h3: (props) => (
            <h3
              className="text-xl font-semibold text-teal-300 mt-12 mb-4"
              {...props}
            />
          ),

          p: (props) => (
            <p
              className="text-lg leading-relaxed text-slate-300 mb-6"
              {...props}
            />
          ),

          strong: (props) => (
            <strong className="font-semibold text-white" {...props} />
          ),

          ul: (props) => (
            <ul
              className="space-y-3 mb-8 ml-6 list-disc marker:text-teal-400"
              {...props}
            />
          ),

          ol: (props) => (
            <ol
              className="space-y-3 mb-8 ml-6 list-decimal marker:text-slate-500"
              {...props}
            />
          ),

          li: (props) => (
            <li className="pl-1" {...props} />
          ),

          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-teal-500/50 pl-6 py-2 my-8 italic text-slate-400 bg-slate-900/40 rounded-r-lg"
              {...props}
            />
          ),

          a: (props) => (
            <a
              className="text-teal-400 hover:text-teal-300 underline decoration-teal-400/30 hover:decoration-teal-400 transition-all"
              {...props}
            />
          ),

code: ({node, inline, className, children, ...props}) => {
  if (inline) {
    return (
      <code
        className="bg-slate-800 px-1.5 py-0.5 rounded text-teal-200 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <pre className="bg-[#0d1117] p-5 rounded-xl overflow-x-auto my-8 border border-slate-800 shadow-lg">
      <code className="text-sm font-mono text-slate-300" {...props}>
        {children}
      </code>
    </pre>
  );
}
        }}
      >
        {content}
      </ReactMarkdown>
    </section>
  );
}