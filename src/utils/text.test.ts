import test from 'node:test';
import assert from 'node:assert/strict';
import { removeVietnameseAccents, tokenizeWords } from './text';

test('removeVietnameseAccents correctly strips accents and lowercases', () => {
  assert.equal(removeVietnameseAccents('Kiếm tiền & Đầu tư'), 'kiem tien & dau tu');
  assert.equal(removeVietnameseAccents('Đắc Nhân Tâm'), 'dac nhan tam');
  assert.equal(removeVietnameseAccents('Nguyễn Nhật Ánh'), 'nguyen nhat anh');
});

test('tokenizeWords produces clean words without punctuation', () => {
  const tokens = tokenizeWords('tôi muốn học code, lập trình python!');
  assert.ok(tokens.includes('code'));
  assert.ok(tokens.includes('lap'));
  assert.ok(tokens.includes('trinh'));
  assert.ok(tokens.includes('python'));
});
