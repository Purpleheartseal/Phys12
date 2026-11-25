import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTexProps {
  tex: string;
  block?: boolean;
  className?: string;
}

export const MathTex: React.FC<MathTexProps> = ({ tex, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch {
      return tex;
    }
  }, [tex, block]);

  if (block) {
    return (
      <div
        className={`math-block-ltr text-center ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`math-ltr ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Renders Persian prose supporting inline $...$ LaTeX, **bold**, and \n line breaks seamlessly.
 */
export const RichMathText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  const lines = useMemo(() => text.split('\n'), [text]);

  const renderInline = (line: string, keyPrefix: string) => {
    const tokens: { type: 'text' | 'math' | 'bold'; content: string }[] = [];
    const regex = /\$([^$]+)\$|\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'text', content: line.slice(lastIndex, match.index) });
      }
      if (match[1] !== undefined) {
        tokens.push({ type: 'math', content: match[1] });
      } else if (match[2] !== undefined) {
        tokens.push({ type: 'bold', content: match[2] });
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < line.length) {
      tokens.push({ type: 'text', content: line.slice(lastIndex) });
    }
    return tokens.map((tok, idx) => {
      const k = `${keyPrefix}-${idx}`;
      if (tok.type === 'math') {
        return <MathTex key={k} tex={tok.content} className="mx-0.5 font-medium" />;
      }
      if (tok.type === 'bold') {
        return (
          <strong key={k} className="font-extrabold text-slate-900 dark:text-white">
            {renderInline(tok.content, `${k}-b`)}
          </strong>
        );
      }
      return <React.Fragment key={k}>{tok.content}</React.Fragment>;
    });
  };

  return (
    <span className={className}>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <br />}
          {renderInline(line, `l${idx}`)}
        </React.Fragment>
      ))}
    </span>
  );
};
