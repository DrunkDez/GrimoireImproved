"use client"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null

  // Simple markdown parser
  const renderParagraph = (text: string) => {
    let html = text

    // Bold: **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')

    // Italic: *text* or _text_
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    html = html.replace(/_(.*?)_/g, '<em>$1</em>')

    // Inline code: `code`
    html = html.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')

    // Links: [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline hover:text-accent" target="_blank" rel="noopener noreferrer">$1</a>')

    return html
  }

  const renderContent = () => {
    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    let currentList: string[] | null = null
    let currentOrderedList: string[] | null = null
    let inBlockquote = false
    let blockquoteLines: string[] = []

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      // Headings
      if (trimmedLine.startsWith('## ')) {
        if (currentList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 mb-4">
              {currentList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
              ))}
            </ul>
          )
          currentList = null
        }
        if (currentOrderedList) {
          elements.push(
            <ol key={`ol-${index}`} className="list-decimal list-inside space-y-1 mb-4">
              {currentOrderedList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
              ))}
            </ol>
          )
          currentOrderedList = null
        }
        const headingText = trimmedLine.substring(3)
        elements.push(
          <h2 key={index} className="text-xl font-bold text-primary mt-6 mb-3">
            {headingText}
          </h2>
        )
      }
      // Bullet list
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (currentOrderedList) {
          elements.push(
            <ol key={`ol-${index}`} className="list-decimal list-inside space-y-1 mb-4">
              {currentOrderedList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
              ))}
            </ol>
          )
          currentOrderedList = null
        }
        const listItem = trimmedLine.substring(2)
        if (!currentList) {
          currentList = []
        }
        currentList.push(listItem)
      }
      // Numbered list
      else if (/^\d+\.\s/.test(trimmedLine)) {
        if (currentList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 mb-4">
              {currentList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
              ))}
            </ul>
          )
          currentList = null
        }
        const listItem = trimmedLine.replace(/^\d+\.\s/, '')
        if (!currentOrderedList) {
          currentOrderedList = []
        }
        currentOrderedList.push(listItem)
      }
      // Blockquote
      else if (trimmedLine.startsWith('> ')) {
        if (currentList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 mb-4">
              {currentList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
              ))}
            </ul>
          )
          currentList = null
        }
        if (currentOrderedList) {
          elements.push(
            <ol key={`ol-${index}`} className="list-decimal list-inside space-y-1 mb-4">
              {currentOrderedList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
              ))}
            </ol>
          )
          currentOrderedList = null
        }
        inBlockquote = true
        blockquoteLines.push(trimmedLine.substring(2))
      }
      // Regular paragraph or empty line
      else {
        if (currentList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 mb-4">
              {currentList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
              ))}
            </ul>
          )
          currentList = null
        }
        if (currentOrderedList) {
          elements.push(
            <ol key={`ol-${index}`} className="list-decimal list-inside space-y-1 mb-4">
              {currentOrderedList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
              ))}
            </ol>
          )
          currentOrderedList = null
        }
        if (inBlockquote && !trimmedLine.startsWith('> ')) {
          elements.push(
            <blockquote key={`quote-${index}`} className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
              {blockquoteLines.map((quoteLine, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(quoteLine) }} />
              ))}
            </blockquote>
          )
          blockquoteLines = []
          inBlockquote = false
        }

        if (trimmedLine) {
          elements.push(
            <p
              key={index}
              className="mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderParagraph(trimmedLine) }}
            />
          )
        }
      }
    })

    // Close any remaining lists
    if (currentList) {
      elements.push(
        <ul key="ul-final" className="list-disc list-inside space-y-1 mb-4">
          {currentList.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
          ))}
        </ul>
      )
    }
    if (currentOrderedList) {
      elements.push(
        <ol key="ol-final" className="list-decimal list-inside space-y-1 mb-4">
          {currentOrderedList.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(item) }} />
          ))}
        </ol>
      )
    }
    if (blockquoteLines.length > 0) {
      elements.push(
        <blockquote key="quote-final" className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
          {blockquoteLines.map((quoteLine, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: renderParagraph(quoteLine) }} />
          ))}
        </blockquote>
      )
    }

    return elements
  }

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {renderContent()}
    </div>
  )
}
