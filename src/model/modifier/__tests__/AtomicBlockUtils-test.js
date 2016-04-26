/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails isaac, oncall+ui_infra
 */

'use strict';

jest.disableAutomock();

const {insertAtomicBlock} = require('AtomicBlockUtils');
const EditorState = require('EditorState');

const getSampleStateForTesting = require('getSampleStateForTesting');

describe('AtomicBlockUtils', () => {
  const {
    editorState,
    contentState,
    selectionState,
  } = getSampleStateForTesting();
  const originalFirstBlock = contentState.getBlockMap().first();
  const entityKey = 'abc';
  const character = ' ';

  function assertAtomicBlock(block) {
    expect(block.getType()).toBe('atomic');
    expect(block.getText()).toBe(character);
    expect(block.getCharacterList().first().getEntity()).toBe(entityKey);
  }

  describe('Collapsed cursor', () => {
    it('must insert atomic at start of block', () => {
      const resultEditor = insertAtomicBlock(
        editorState,
        entityKey,
        character
      );
      const resultContent = resultEditor.getCurrentContent();

      // Empty block inserted above content.
      const firstBlock = resultContent.getBlockMap().first();
      expect(firstBlock.getType()).toBe('unstyled');
      expect(firstBlock.getText()).toBe('');

      const secondBlock = resultContent.getBlockMap().skip(1).first();
      assertAtomicBlock(secondBlock);

      const thirdBlock = resultContent.getBlockMap().skip(2).first();
      expect(thirdBlock.getText()).toBe(originalFirstBlock.getText());
    });

    it('must insert atomic within a block, via split', () => {
      const targetSelection = selectionState.merge({
        anchorOffset: 2,
        focusOffset: 2,
      });
      const targetEditor = EditorState.forceSelection(
        editorState,
        targetSelection
      );

      const resultEditor = insertAtomicBlock(
        targetEditor,
        entityKey,
        character
      );
      const resultContent = resultEditor.getCurrentContent();

      const firstBlock = resultContent.getBlockMap().first();
      expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
      expect(
        firstBlock.getText()
      ).toBe(
        originalFirstBlock.getText().slice(0, 2)
      );

      const secondBlock = resultContent.getBlockMap().skip(1).first();
      assertAtomicBlock(secondBlock);

      const thirdBlock = resultContent.getBlockMap().skip(2).first();
      expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
      expect(thirdBlock.getText()).toBe(originalFirstBlock.getText().slice(2));
    });

    it('must insert atomic after a block', () => {
      const targetSelection = selectionState.merge({
        anchorOffset: originalFirstBlock.getLength(),
        focusOffset: originalFirstBlock.getLength(),
      });
      const targetEditor = EditorState.forceSelection(
        editorState,
        targetSelection
      );

      const resultEditor = insertAtomicBlock(
        targetEditor,
        entityKey,
        character
      );
      const resultContent = resultEditor.getCurrentContent();

      const firstBlock = resultContent.getBlockMap().first();
      expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
      expect(firstBlock.getText()).toBe(originalFirstBlock.getText());

      const secondBlock = resultContent.getBlockMap().skip(1).first();
      assertAtomicBlock(secondBlock);

      const thirdBlock = resultContent.getBlockMap().skip(2).first();
      expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
      expect(thirdBlock.getText()).toBe('');
    });
  });

  describe('Non-collapsed cursor', () => {
    it('must insert atomic at start of block', () => {
      const targetSelection = selectionState.merge({
        anchorOffset: 0,
        focusOffset: 2,
      });
      const targetEditor = EditorState.forceSelection(
        editorState,
        targetSelection
      );

      const resultEditor = insertAtomicBlock(
        targetEditor,
        entityKey,
        character
      );
      const resultContent = resultEditor.getCurrentContent();

      const firstBlock = resultContent.getBlockMap().first();
      expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
      expect(firstBlock.getText()).toBe('');

      const secondBlock = resultContent.getBlockMap().skip(1).first();
      assertAtomicBlock(secondBlock);

      const thirdBlock = resultContent.getBlockMap().skip(2).first();
      expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
      expect(thirdBlock.getText()).toBe(originalFirstBlock.getText().slice(2));
    });

    it('must insert atomic within a block', () => {
      const targetSelection = selectionState.merge({
        anchorOffset: 1,
        focusOffset: 2,
      });
      const targetEditor = EditorState.forceSelection(
        editorState,
        targetSelection
      );

      const resultEditor = insertAtomicBlock(
        targetEditor,
        entityKey,
        character
      );
      const resultContent = resultEditor.getCurrentContent();

      const firstBlock = resultContent.getBlockMap().first();
      expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
      expect(
        firstBlock.getText()
      ).toBe(
        originalFirstBlock.getText().slice(0, 1)
      );

      const secondBlock = resultContent.getBlockMap().skip(1).first();
      assertAtomicBlock(secondBlock);

      const thirdBlock = resultContent.getBlockMap().skip(2).first();
      expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
      expect(thirdBlock.getText()).toBe(originalFirstBlock.getText().slice(2));
    });

    it('must insert atomic at end of block', () => {
      const origLength = originalFirstBlock.getLength();
      const targetSelection = selectionState.merge({
        anchorOffset: origLength - 2,
        focusOffset: origLength,
      });
      const targetEditor = EditorState.forceSelection(
        editorState,
        targetSelection
      );

      const resultEditor = insertAtomicBlock(
        targetEditor,
        entityKey,
        character
      );
      const resultContent = resultEditor.getCurrentContent();

      const firstBlock = resultContent.getBlockMap().first();
      expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
      expect(
        firstBlock.getText()
      ).toBe(
        originalFirstBlock.getText().slice(0, origLength - 2)
      );

      const secondBlock = resultContent.getBlockMap().skip(1).first();
      assertAtomicBlock(secondBlock);

      const thirdBlock = resultContent.getBlockMap().skip(2).first();
      expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
      expect(thirdBlock.getText()).toBe('');
    });

    it('must insert atomic for cross-block selection', () => {
      const originalThirdBlock = contentState.getBlockMap().skip(2).first();

      const targetSelection = selectionState.merge({
        anchorOffset: 2,
        focusKey: originalThirdBlock.getKey(),
        focusOffset: 2,
      });
      const targetEditor = EditorState.forceSelection(
        editorState,
        targetSelection
      );

      const resultEditor = insertAtomicBlock(
        targetEditor,
        entityKey,
        character
      );
      const resultContent = resultEditor.getCurrentContent();

      const firstBlock = resultContent.getBlockMap().first();
      expect(firstBlock.getType()).toBe(originalFirstBlock.getType());
      expect(
        firstBlock.getText()
      ).toBe(
        originalFirstBlock.getText().slice(0, 2)
      );

      const secondBlock = resultContent.getBlockMap().skip(1).first();
      assertAtomicBlock(secondBlock);

      // Third block gets original first block's type, but sliced text from
      // original second block.
      const thirdBlock = resultContent.getBlockMap().skip(2).first();
      expect(thirdBlock.getType()).toBe(originalFirstBlock.getType());
      expect(thirdBlock.getText()).toBe(originalThirdBlock.getText().slice(2));
    });
  });
});
