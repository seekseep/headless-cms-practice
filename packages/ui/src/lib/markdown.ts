import { marked, type Token, type Tokens } from 'marked';

export function extractFirstParagraphText(markdown: string, maxLength: number = 300): string {
  const tokens = marked.lexer(markdown);

  const paragraph = tokens.find(
    (token): token is Tokens.Paragraph => token.type === 'paragraph'
  );

  if (!paragraph) {
    return '';
  }

  const plainText = collectText(paragraph.tokens);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength) + '...';
}

function collectText(tokens: Token[]): string {
  let result = '';

  for (const token of tokens) {
    switch (token.type) {
      case 'text':
      case 'codespan':
      case 'escape':
        result += token.text;
        break;
      case 'br':
        result += ' ';
        break;
      default:
        if ('tokens' in token && Array.isArray(token.tokens)) {
          result += collectText(token.tokens);
        }
        break;
    }
  }

  return result;
}
