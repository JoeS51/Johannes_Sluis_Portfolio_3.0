import { useEffect, useRef, useState } from 'react';

const cloneBlocks = (blocks) => blocks.map((block) => ({ ...block }));

const getTextLength = (block) => block.text.length;

const clampColumn = (block, column) => {
  return Math.min(Math.max(column, 0), Math.max(getTextLength(block) - 1, 0));
};

const clampInsertOffset = (block, offset) => {
  return Math.min(Math.max(offset, 0), getTextLength(block));
};

const isWordCharacter = (character) => /[A-Za-z0-9_]/.test(character);

const placeCaretAtOffset = (element, offset) => {
  const selection = window.getSelection();
  if (!selection) return;

  const walker = document.createTreeWalker(element, window.NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let remainingOffset = offset;
  let currentNode = walker.nextNode();

  while (currentNode) {
    const textLength = currentNode.textContent.length;

    if (remainingOffset <= textLength) {
      range.setStart(currentNode, remainingOffset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    remainingOffset -= textLength;
    currentNode = walker.nextNode();
  }

  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

const getCaretOffset = (element) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 0;

  const range = selection.getRangeAt(0);
  if (!element.contains(range.startContainer)) return 0;

  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.startContainer, range.startOffset);
  return preCaretRange.toString().length;
};

const createBlankBlock = () => ({
  type: 'p',
  text: 'A fresh Vim buffer line waiting for insert mode.',
});

const getModeLabel = (mode, pendingOperator) => {
  if (pendingOperator) return '-- OPERATOR PENDING: PRESS D AGAIN, COWARD --';
  if (mode === 'insert') return '-- INSERT: TEMPORARY THOUGHTS ONLY --';
  return '-- NORMAL: THE MOUSE IS A RUMOR --';
};

const getModeName = (mode, pendingOperator) => {
  if (pendingOperator) return 'operator pending';
  return mode;
};

const VimEditableArticle = ({ blocks: initialBlocks }) => {
  const [blocks, setBlocks] = useState(() => cloneBlocks(initialBlocks));
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursorColumn, setCursorColumn] = useState(0);
  const [mode, setMode] = useState('normal');
  const [pendingOperator, setPendingOperator] = useState('');
  const [statusMessage, setStatusMessage] = useState('edits live here until the page refresh goblin eats them');
  const articleRef = useRef(null);
  const blockRefs = useRef([]);
  const hasActivatedRef = useRef(false);
  const desiredColumnRef = useRef(0);
  const insertOffsetRef = useRef(0);
  const historyRef = useRef([]);

  const saveUndoSnapshot = () => {
    historyRef.current = [
      ...historyRef.current.slice(-24),
      {
        blocks: cloneBlocks(blocks),
        activeIndex,
        cursorColumn,
      },
    ];
  };

  const commitBlock = (index) => {
    const element = blockRefs.current[index];
    if (!element) return;

    const text = element.innerText.replace(/\u00a0/g, ' ').trimEnd();
    setBlocks((currentBlocks) =>
      currentBlocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, text } : block
      )
    );
  };

  const enterInsertMode = (offset = cursorColumn) => {
    saveUndoSnapshot();
    insertOffsetRef.current = clampInsertOffset(blocks[activeIndex], offset);
    setStatusMessage('insert mode: make your typo with confidence');
    setMode('insert');
  };

  const returnToNormalMode = () => {
    const element = blockRefs.current[activeIndex];
    const text = element ? element.innerText.replace(/\u00a0/g, ' ').trimEnd() : blocks[activeIndex].text;
    const caretOffset = element ? getCaretOffset(element) : cursorColumn;

    setBlocks((currentBlocks) =>
      currentBlocks.map((block, blockIndex) =>
        blockIndex === activeIndex ? { ...block, text } : block
      )
    );
    setCursorColumn(Math.min(Math.max(caretOffset - 1, 0), Math.max(text.length - 1, 0)));
    desiredColumnRef.current = Math.min(Math.max(caretOffset - 1, 0), Math.max(text.length - 1, 0));
    setStatusMessage('escaped insert mode without saving anything real');
    setMode('normal');
  };

  const setActiveLine = (nextIndex, nextColumn = desiredColumnRef.current) => {
    const clampedIndex = Math.min(Math.max(nextIndex, 0), blocks.length - 1);
    const clampedColumn = clampColumn(blocks[clampedIndex], nextColumn);
    setActiveIndex(clampedIndex);
    setCursorColumn(clampedColumn);
  };

  const moveVertical = (step) => {
    setActiveIndex((currentIndex) => {
      const nextIndex = Math.min(Math.max(currentIndex + step, 0), blocks.length - 1);
      setCursorColumn(clampColumn(blocks[nextIndex], desiredColumnRef.current));
      return nextIndex;
    });
  };

  const moveHorizontal = (step) => {
    const nextColumn = clampColumn(blocks[activeIndex], cursorColumn + step);
    desiredColumnRef.current = nextColumn;
    setCursorColumn(nextColumn);
  };

  const moveToLineStart = () => {
    desiredColumnRef.current = 0;
    setCursorColumn(0);
  };

  const moveToFirstNonBlank = () => {
    const firstNonBlank = blocks[activeIndex].text.search(/\S/);
    const nextColumn = firstNonBlank === -1 ? 0 : firstNonBlank;
    desiredColumnRef.current = nextColumn;
    setCursorColumn(nextColumn);
  };

  const moveToLineEnd = () => {
    const nextColumn = clampColumn(blocks[activeIndex], getTextLength(blocks[activeIndex]) - 1);
    desiredColumnRef.current = nextColumn;
    setCursorColumn(nextColumn);
  };

  const moveToPosition = (nextIndex, nextColumn) => {
    const clampedColumn = clampColumn(blocks[nextIndex], nextColumn);
    setActiveIndex(nextIndex);
    setCursorColumn(clampedColumn);
    desiredColumnRef.current = clampedColumn;
  };

  const moveWordForward = () => {
    for (let blockIndex = activeIndex; blockIndex < blocks.length; blockIndex += 1) {
      const text = blocks[blockIndex].text;
      const startColumn = blockIndex === activeIndex ? cursorColumn + 1 : 0;

      for (let column = startColumn; column < text.length; column += 1) {
        const character = text[column];
        const previousCharacter = text[column - 1];

        if (isWordCharacter(character) && !isWordCharacter(previousCharacter || '')) {
          moveToPosition(blockIndex, column);
          return;
        }
      }
    }

    moveToPosition(blocks.length - 1, getTextLength(blocks[blocks.length - 1]) - 1);
  };

  const moveWordBackward = () => {
    for (let blockIndex = activeIndex; blockIndex >= 0; blockIndex -= 1) {
      const text = blocks[blockIndex].text;
      let column = blockIndex === activeIndex ? cursorColumn - 1 : text.length - 1;

      while (column >= 0 && !isWordCharacter(text[column])) {
        column -= 1;
      }

      if (column < 0) continue;

      while (column > 0 && isWordCharacter(text[column - 1])) {
        column -= 1;
      }

      moveToPosition(blockIndex, column);
      return;
    }

    moveToPosition(0, 0);
  };

  const insertBlock = (offset) => {
    saveUndoSnapshot();
    setBlocks((currentBlocks) => {
      const nextBlocks = [...currentBlocks];
      const nextIndex = activeIndex + offset;
      nextBlocks.splice(nextIndex, 0, createBlankBlock());
      return nextBlocks;
    });
    setActiveIndex(activeIndex + offset);
    setCursorColumn(0);
    desiredColumnRef.current = 0;
    insertOffsetRef.current = 0;
    setStatusMessage(offset === 0 ? 'opened a line above like a polite gremlin' : 'opened a line below like Vim intended');
    setMode('insert');
  };

  const deleteCursorCharacter = () => {
    const block = blocks[activeIndex];
    if (!block.text) return;

    saveUndoSnapshot();
    const nextText = `${block.text.slice(0, cursorColumn)}${block.text.slice(cursorColumn + 1)}`;
    const nextColumn = Math.min(cursorColumn, Math.max(nextText.length - 1, 0));

    setBlocks((currentBlocks) =>
      currentBlocks.map((currentBlock, blockIndex) =>
        blockIndex === activeIndex ? { ...currentBlock, text: nextText } : currentBlock
      )
    );
    setCursorColumn(nextColumn);
    desiredColumnRef.current = nextColumn;
    setStatusMessage('deleted one character; it probably deserved it');
  };

  const deleteActiveBlock = () => {
    saveUndoSnapshot();

    if (blocks.length === 1) {
      setBlocks([{ ...blocks[0], text: '' }]);
      setCursorColumn(0);
      desiredColumnRef.current = 0;
      setStatusMessage('dd emptied the last surviving line');
      return;
    }

    const nextBlocks = blocks.filter((_, index) => index !== activeIndex);
    const nextIndex = Math.min(activeIndex, nextBlocks.length - 1);
    setBlocks(nextBlocks);
    setActiveIndex(nextIndex);
    setCursorColumn(0);
    desiredColumnRef.current = 0;
    setStatusMessage('dd deleted the whole line; very dramatic');
  };

  const undoLastChange = () => {
    const snapshot = historyRef.current[historyRef.current.length - 1];

    if (!snapshot) {
      setStatusMessage('nothing to undo; the timeline is already clean');
      return;
    }

    historyRef.current = historyRef.current.slice(0, -1);
    setBlocks(cloneBlocks(snapshot.blocks));
    setActiveIndex(snapshot.activeIndex);
    setCursorColumn(snapshot.cursorColumn);
    desiredColumnRef.current = snapshot.cursorColumn;
    setMode('normal');
    setPendingOperator('');
    setStatusMessage('u undid the last questionable decision');
  };

  const resetArticle = () => {
    setBlocks(cloneBlocks(initialBlocks));
    setActiveIndex(0);
    setCursorColumn(0);
    desiredColumnRef.current = 0;
    historyRef.current = [];
    setPendingOperator('');
    setStatusMessage('reset the buffer back to its factory nonsense');
    setMode('normal');
  };

  const handleKeyDown = (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (mode === 'insert') {
      if (event.key === 'Escape') {
        event.preventDefault();
        returnToNormalMode();
      }
      return;
    }

    const handledKeys = ['h', 'j', 'k', 'l', 'w', 'b', '0', '$', '^', 'g', 'G', 'i', 'a', 'o', 'O', 'x', 'd', 'u', 'r'];
    if (!handledKeys.includes(event.key)) return;

    event.preventDefault();

    if (pendingOperator === 'd') {
      setPendingOperator('');

      if (event.key === 'd') {
        deleteActiveBlock();
        return;
      }
    }

    switch (event.key) {
      case 'h':
        moveHorizontal(-1);
        break;
      case 'l':
        moveHorizontal(1);
        break;
      case 'k':
        moveVertical(-1);
        break;
      case 'j':
        moveVertical(1);
        break;
      case 'w':
        moveWordForward();
        break;
      case 'b':
        moveWordBackward();
        break;
      case '0':
        moveToLineStart();
        break;
      case '^':
        moveToFirstNonBlank();
        break;
      case '$':
        moveToLineEnd();
        break;
      case 'g':
        desiredColumnRef.current = 0;
        setActiveLine(0, 0);
        break;
      case 'G':
        desiredColumnRef.current = 0;
        setActiveLine(blocks.length - 1, 0);
        break;
      case 'i':
        enterInsertMode(cursorColumn);
        break;
      case 'a':
        enterInsertMode(cursorColumn + 1);
        break;
      case 'o':
        insertBlock(1);
        break;
      case 'O':
        insertBlock(0);
        break;
      case 'x':
        deleteCursorCharacter();
        break;
      case 'd':
        setPendingOperator('d');
        setStatusMessage('d what? press d again for dd');
        break;
      case 'u':
        undoLastChange();
        break;
      case 'r':
        resetArticle();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const activeElement = blockRefs.current[activeIndex];
    if (!activeElement) return;

    if (hasActivatedRef.current) {
      activeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }

    hasActivatedRef.current = true;

    if (mode === 'insert') {
      activeElement.focus({ preventScroll: true });
      placeCaretAtOffset(activeElement, insertOffsetRef.current);
      return;
    }

    articleRef.current?.focus({ preventScroll: true });
  }, [activeIndex, mode]);

  const renderCursorText = (text, isActive, isEditing) => {
    if (!isActive || isEditing) return text;

    const safeText = text || ' ';
    const column = Math.min(cursorColumn, safeText.length - 1);
    const before = safeText.slice(0, column);
    const cursorChar = safeText[column] === ' ' ? '\u00a0' : safeText[column];
    const after = safeText.slice(column + 1);

    return (
      <>
        {before}
        <span className="vim-character-cursor">{cursorChar}</span>
        {after}
      </>
    );
  };

  const renderEditableBlock = (block, index) => {
    const isActive = activeIndex === index;
    const isEditing = isActive && mode === 'insert';
    const editableProps = {
      ref: (element) => {
        blockRefs.current[index] = element;
      },
      contentEditable: isEditing,
      suppressContentEditableWarning: true,
      tabIndex: -1,
      onBlur: () => commitBlock(index),
      onClick: () => {
        setActiveIndex(index);
        setCursorColumn((currentColumn) => {
          const nextColumn = clampColumn(blocks[index], currentColumn);
          desiredColumnRef.current = nextColumn;
          return nextColumn;
        });
        if (mode === 'normal') {
          articleRef.current?.focus({ preventScroll: true });
        }
      },
      className: `${isActive ? 'is-active' : ''} ${isEditing ? 'is-editing' : ''}`.trim(),
      'data-vim-line': index + 1,
    };

    switch (block.type) {
      case 'h2':
        return (
          <h2
            key={`${block.type}-${index}`}
            id={block.id}
            {...editableProps}
            className={`blog-heading-2 vim-editable-block ${editableProps.className}`.trim()}
          >
            {renderCursorText(block.text, isActive, isEditing)}
          </h2>
        );
      case 'h3':
        return (
          <h3
            key={`${block.type}-${index}`}
            id={block.id}
            {...editableProps}
            className={`blog-heading-3 vim-editable-block ${editableProps.className}`.trim()}
          >
            {renderCursorText(block.text, isActive, isEditing)}
          </h3>
        );
      case 'quote':
        return (
          <blockquote
            key={`${block.type}-${index}`}
            {...editableProps}
            className={`blog-quote vim-editable-block ${editableProps.className}`.trim()}
          >
            {renderCursorText(block.text, isActive, isEditing)}
          </blockquote>
        );
      case 'code':
        return (
          <pre
            key={`${block.type}-${index}`}
            {...editableProps}
            className={`blog-code-block vim-editable-block ${editableProps.className}`.trim()}
          >
            <code>{renderCursorText(block.text, isActive, isEditing)}</code>
          </pre>
        );
      default:
        return (
          <p
            key={`${block.type}-${index}`}
            {...editableProps}
            className={`blog-paragraph vim-editable-block ${editableProps.className}`.trim()}
          >
            {renderCursorText(block.text, isActive, isEditing)}
          </p>
        );
    }
  };

  return (
    <section
      ref={articleRef}
      className={`vim-editor-shell vim-mode-${pendingOperator ? 'operator' : mode}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Editable Vim article. Use i to edit, escape for normal mode, and j or k to move."
    >
      <div className="vim-editor-help">
        <strong>Vim test buffer</strong>
        <span>Normal: h/l move cursor, w/b move by word, 0/^/$ line jumps, j/k move lines, dd delete line, u undo, r reset. Insert: Esc returns to normal.</span>
      </div>

      {blocks.map(renderEditableBlock)}

      <div className="vim-status-line" aria-live="polite">
        <span>{getModeLabel(mode, pendingOperator)}</span>
        <span>{activeIndex + 1}/{blocks.length}:{cursorColumn + 1}</span>
        <span>{statusMessage}</span>
      </div>

      <div className="vim-mode-overlay" aria-live="polite">
        <span>Mode</span>
        <strong>{getModeName(mode, pendingOperator)}</strong>
      </div>
    </section>
  );
};

export default VimEditableArticle;
