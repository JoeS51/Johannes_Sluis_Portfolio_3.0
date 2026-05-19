import { useEffect, useRef, useState } from 'react';

const cloneBlocks = (blocks) => blocks.map((block) => ({ ...block }));

const getTextLength = (block) => block.text.length;

const clampColumn = (block, column) => {
  return Math.min(Math.max(column, 0), Math.max(getTextLength(block) - 1, 0));
};

const clampInsertOffset = (block, offset) => {
  return Math.min(Math.max(offset, 0), getTextLength(block));
};

const getLinePosition = (text, offset) => {
  const lines = text.split('\n');
  const clampedOffset = Math.min(Math.max(offset, 0), Math.max(text.length - 1, 0));
  let lineStart = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const lineText = lines[lineIndex];
    const lineEnd = lineStart + lineText.length;

    if (clampedOffset <= lineEnd || lineIndex === lines.length - 1) {
      return {
        lineIndex,
        lineStart,
        lineText,
        column: Math.min(clampedOffset - lineStart, Math.max(lineText.length - 1, 0)),
      };
    }

    lineStart = lineEnd + 1;
  }

  return {
    lineIndex: 0,
    lineStart: 0,
    lineText: text,
    column: 0,
  };
};

const getOffsetForLineColumn = (text, lineIndex, column) => {
  const lines = text.split('\n');
  const targetLineIndex = Math.min(Math.max(lineIndex, 0), lines.length - 1);
  const lineStart = lines.slice(0, targetLineIndex).reduce((offset, line) => offset + line.length + 1, 0);
  const lineText = lines[targetLineIndex];
  const targetColumn = Math.min(Math.max(column, 0), Math.max(lineText.length - 1, 0));

  return lineStart + targetColumn;
};

const getVisualColumn = (block, offset) => getLinePosition(block.text, offset).column;

const clampVisibleColumn = (block, offset) => {
  const clampedOffset = clampColumn(block, offset);
  const linePosition = getLinePosition(block.text, clampedOffset);

  return getOffsetForLineColumn(block.text, linePosition.lineIndex, linePosition.column);
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

const getCaretOffsetFromPoint = (element, clientX, clientY) => {
  let range = null;

  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(clientX, clientY);

    if (position && element.contains(position.offsetNode)) {
      range = document.createRange();
      range.setStart(position.offsetNode, position.offset);
      range.collapse(true);
    }
  } else if (document.caretRangeFromPoint) {
    const pointRange = document.caretRangeFromPoint(clientX, clientY);

    if (pointRange && element.contains(pointRange.startContainer)) {
      range = pointRange;
    }
  }

  if (!range) return null;

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
  if (mode === 'command') return ':';
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
  const [commandInput, setCommandInput] = useState('');
  const [commandFeedback, setCommandFeedback] = useState('');
  const [statusMessage, setStatusMessage] = useState('edits live here until the page refresh goblin eats them');
  const articleRef = useRef(null);
  const blockRefs = useRef([]);
  const hasActivatedRef = useRef(false);
  const desiredColumnRef = useRef(0);
  const insertOffsetRef = useRef(0);
  const historyRef = useRef([]);
  const commandFeedbackTimeoutRef = useRef(0);

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
    const nextColumn = clampVisibleColumn({ text }, caretOffset - 1);
    setCursorColumn(nextColumn);
    desiredColumnRef.current = getVisualColumn({ text }, nextColumn);
    setStatusMessage('escaped insert mode without saving anything real');
    setMode('normal');
  };

  const showCommandFeedback = (message) => {
    setCommandFeedback(message);

    if (commandFeedbackTimeoutRef.current) {
      window.clearTimeout(commandFeedbackTimeoutRef.current);
    }

    commandFeedbackTimeoutRef.current = window.setTimeout(() => {
      setCommandFeedback('');
    }, 2200);
  };

  const enterCommandMode = () => {
    setPendingOperator('');
    setCommandInput('');
    setStatusMessage('command-line mode: type w, q, wq, or reset');
    setMode('command');
  };

  const submitCommand = () => {
    const command = commandInput.trim().toLowerCase();

    setCommandInput('');
    setMode('normal');

    if (!command) {
      setStatusMessage('command cancelled');
      return;
    }

    if (command === 'w' || command === 'write') {
      setStatusMessage('pretended to write the temporary buffer');
      showCommandFeedback('"vim-test-buffer" saved (not really)');
      return;
    }

    if (command === 'q' || command === 'quit') {
      setStatusMessage('pretended to quit, but the article is still here');
      showCommandFeedback('quit requested');
      return;
    }

    if (command === 'wq' || command === 'x') {
      setStatusMessage('pretended to save and quit; very responsible');
      showCommandFeedback('saved and quit (emotionally)');
      return;
    }

    if (command === 'reset') {
      resetArticle();
      showCommandFeedback('buffer reset');
      return;
    }

    setStatusMessage(`not an editor command: ${command}`);
    showCommandFeedback(`E492: Not an editor command: ${command}`);
  };

  const setActiveLine = (nextIndex, nextColumn = desiredColumnRef.current) => {
    const clampedIndex = Math.min(Math.max(nextIndex, 0), blocks.length - 1);
    const clampedColumn = clampVisibleColumn(blocks[clampedIndex], nextColumn);
    setActiveIndex(clampedIndex);
    setCursorColumn(clampedColumn);
  };

  const moveVertical = (step) => {
    const block = blocks[activeIndex];
    const lines = block.text.split('\n');

    if (lines.length > 1) {
      const linePosition = getLinePosition(block.text, cursorColumn);
      const nextLineIndex = linePosition.lineIndex + step;

      if (nextLineIndex >= 0 && nextLineIndex < lines.length) {
        setCursorColumn(getOffsetForLineColumn(block.text, nextLineIndex, desiredColumnRef.current));
        return;
      }
    }

    setActiveIndex((currentIndex) => {
      const nextIndex = Math.min(Math.max(currentIndex + step, 0), blocks.length - 1);
      setCursorColumn(clampVisibleColumn(blocks[nextIndex], desiredColumnRef.current));
      return nextIndex;
    });
  };

  const moveHorizontal = (step) => {
    const block = blocks[activeIndex];
    const linePosition = getLinePosition(block.text, cursorColumn);
    const nextColumn = clampColumn(
      block,
      linePosition.lineStart + linePosition.column + step
    );

    if (nextColumn < linePosition.lineStart || nextColumn >= linePosition.lineStart + linePosition.lineText.length) {
      return;
    }

    desiredColumnRef.current = getVisualColumn(block, nextColumn);
    setCursorColumn(nextColumn);
  };

  const moveToLineStart = () => {
    const linePosition = getLinePosition(blocks[activeIndex].text, cursorColumn);
    desiredColumnRef.current = 0;
    setCursorColumn(linePosition.lineStart);
  };

  const moveToFirstNonBlank = () => {
    const linePosition = getLinePosition(blocks[activeIndex].text, cursorColumn);
    const firstNonBlank = linePosition.lineText.search(/\S/);
    const nextVisualColumn = firstNonBlank === -1 ? 0 : firstNonBlank;
    const nextColumn = linePosition.lineStart + nextVisualColumn;
    desiredColumnRef.current = nextVisualColumn;
    setCursorColumn(nextColumn);
  };

  const moveToLineEnd = () => {
    const linePosition = getLinePosition(blocks[activeIndex].text, cursorColumn);
    const nextColumn = linePosition.lineStart + Math.max(linePosition.lineText.length - 1, 0);
    desiredColumnRef.current = getVisualColumn(blocks[activeIndex], nextColumn);
    setCursorColumn(nextColumn);
  };

  const moveToPosition = (nextIndex, nextColumn) => {
    const clampedColumn = clampVisibleColumn(blocks[nextIndex], nextColumn);
    setActiveIndex(nextIndex);
    setCursorColumn(clampedColumn);
    desiredColumnRef.current = getVisualColumn(blocks[nextIndex], clampedColumn);
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
    desiredColumnRef.current = getVisualColumn({ text: nextText }, nextColumn);
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
    desiredColumnRef.current = getVisualColumn(snapshot.blocks[snapshot.activeIndex], snapshot.cursorColumn);
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

    if (mode === 'command') {
      event.preventDefault();

      if (event.key === 'Escape') {
        setCommandInput('');
        setMode('normal');
        setStatusMessage('command-line mode cancelled');
        return;
      }

      if (event.key === 'Enter') {
        submitCommand();
        return;
      }

      if (event.key === 'Backspace') {
        setCommandInput((currentInput) => currentInput.slice(0, -1));
        return;
      }

      if (event.key.length === 1) {
        setCommandInput((currentInput) => `${currentInput}${event.key}`);
      }

      return;
    }

    if (mode === 'insert') {
      if (event.key === 'Escape') {
        event.preventDefault();
        returnToNormalMode();
      }
      return;
    }

    const handledKeys = ['h', 'j', 'k', 'l', 'w', 'b', '0', '$', '^', 'g', 'G', 'i', 'a', 'o', 'O', 'x', 'd', 'u', 'r', ':'];
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
      case ':':
        enterCommandMode();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (commandFeedbackTimeoutRef.current) {
        window.clearTimeout(commandFeedbackTimeoutRef.current);
      }
    };
  }, []);

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
      onClick: (event) => {
        setActiveIndex(index);
        const clickedOffset = getCaretOffsetFromPoint(event.currentTarget, event.clientX, event.clientY);
        const nextColumn = clampVisibleColumn(blocks[index], clickedOffset ?? cursorColumn);

        setCursorColumn(nextColumn);
        desiredColumnRef.current = getVisualColumn(blocks[index], nextColumn);

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
      {blocks.map(renderEditableBlock)}

      <div className="vim-status-line" aria-live="polite">
        <span>{getModeLabel(mode, pendingOperator)}</span>
        <span>{activeIndex + 1}/{blocks.length}:{cursorColumn + 1}</span>
        <span>{mode === 'command' ? `:${commandInput}` : statusMessage}</span>
      </div>

      {commandFeedback && <div className="vim-command-popup">{commandFeedback}</div>}

      <div className="vim-mode-overlay" aria-live="polite">
        <span>Mode</span>
        <strong>{getModeName(mode, pendingOperator)}</strong>
      </div>
    </section>
  );
};

export default VimEditableArticle;
