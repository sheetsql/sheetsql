import { expect } from 'chai';
import { spy } from 'sinon';
import { Set } from '../../util/set';

describe('Set', () => {

  describe('constructor', () => {
    it('should create a set from an array', () => {
      const set = new Set(['a' ,'b', 'c']);
      expect(set.size).to.equal(3);
    });

    it('should create a set from an array (empty)', () => {
      const set = new Set([]);
      expect(set.size).to.equal(0);
    });

    it('should create a set from an array (single element)', () => {
      const set = new Set(['a']);
      expect(set.size).to.equal(1);
    });

    it('should create a set from an array (duplicates)', () => {
      const set = new Set(['a', 'b', 'c', 'c', 'c']);
      expect(set.size).to.equal(3);
    });

    it('should create a set from an array (numbers)', () => {
      const set = new Set([1, 2, 3, 4, 5]);
      expect(set.size).to.equal(5);
    });

    it('should create a set from an array (mixed types)', () => {
      const set = new Set(['a', 1, ['a', 1]]);
      expect(set.size).to.equal(3);
    });

    it('should allow creating a set with null arg', () => {
      const set = new Set(null);
      expect(set.size).to.equal(0);
    });
  });

  describe('.size', () => {
    it('should initialize to zero', () => {
      const set = new Set([]);
      expect(set.size).to.equal(0);
    });

    it('should increment on addition', () => {
      const set = new Set([]);
      expect(set.size).to.equal(0);
      set.add('a');
      expect(set.size).to.equal(1);
    });

    it('should not increment on non-unique addition', () => {
      const set = new Set([]);
      expect(set.size).to.equal(0);
      set.add('a');
      expect(set.size).to.equal(1);
      set.add('a');
      expect(set.size).to.equal(1);
    });

    it('should decrement on deletion', () => {
      const set = new Set(['a']);
      expect(set.size).to.equal(1);
      set.delete('a');
      expect(set.size).to.equal(0);
    });

    it('should not decrement on non-unique deletion', () => {
      const set = new Set(['a']);
      expect(set.size).to.equal(1);
      set.delete('a');
      expect(set.size).to.equal(0);
      set.delete('a');
      expect(set.size).to.equal(0);
    });
  });

  describe('#add', () => {
    it('should add an item to the returned values', () => {
      const set = new Set([]);
      set.add('a');
      expect(set.values().length).to.equal(1);
      expect(set.values()).to.eql(['a']);
    });

    it('should not add an item to the returned values multiple times', () => {
      const set = new Set([]);
      set.add('a');
      set.add('a');
      expect(set.values().length).to.equal(1);
      expect(set.values()).to.eql(['a']);
    });

    it('should not add the same instances of objects twice', () => {
      const set = new Set([]);
      const obj = {foo: 'bar'};
      set.add(obj);
      set.add(obj);
      expect(set.values().length).to.equal(1);
    });
  });

  describe('#clear', () => {
    it('should reset the size to zero', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(set.size).to.equal(3);
      set.clear();
      expect(set.size).to.equal(0);
    });

    it('should reset the returned values to none', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(set.values().length).to.equal(3);
      set.clear();
      expect(set.values().length).to.equal(0);
    });

    it('should not prevent re-adding values', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(set.size).to.equal(3);
      set.clear();
      expect(set.size).to.equal(0);
      set.add('a');
      expect(set.values().length).to.equal(1);
      expect(set.values()).to.eql(['a']);
    });
  });

  describe('#delete', () => {
    it('should reset the size to n - 1', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(set.size).to.equal(3);
      set.delete('a');
      expect(set.size).to.equal(2);
    });

    it('should reset the size to n - 1, only if the set contains the value', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(set.size).to.equal(3);
      set.delete('d');
      expect(set.size).to.equal(3);
    });

    it('should remove the value from returned values', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(set.values().length).to.equal(3);
      set.delete('a');
      expect(set.values().length).to.equal(2);
      expect(set.values()).to.eql(['b', 'c']);
    });

    it('should not prevent re-adding values', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(set.size).to.equal(3);
      set.delete('a');
      expect(set.size).to.equal(2);
      set.add('a');
      expect(set.values().length).to.equal(3);
      expect(set.values()).to.eql(['b', 'c', 'a']);
    });

  });

  describe('#entries', () => {
    it('should return an array of [value, value] pairs', () => {
      const set = new Set(['a', 'b', 'c']);
      const entries = set.entries();
      entries.forEach((x) => {
        expect(x[0]).to.eql(x[1]);
      });
    });

    it('should return entries in insertion order', () => {
      const arr = ['a', 'b', 'c'];
      const set = new Set(arr);
      const entries = set.entries();
      entries.forEach((x, index) => {
        expect(x[0]).to.eql(arr[index]);
      });

      const arr2 = ['c', 'b', 'a'];
      const set2 = new Set(arr2);
      const entries2 = set2.entries();
      entries2.forEach((x, index) => {
        expect(x[0]).to.eql(arr2[index]);
      });
    });

    it('should return an empty array for an empty set', () => {
      const set = new Set([]);
      expect(set.entries()).to.eql([]);
    });

    it('should return an empty array for a null set', () => {
      const set = new Set(null);
      expect(set.entries()).to.eql([]);
    });
  });

  describe('#forEach', () => {
    it('should call the callback once for each unique item (single)', () => {
      const set = new Set(['a']);
      const cb = spy();
      set.forEach(cb);
      expect(cb.calledOnce).to.be.true;
    });

    it('should call the callback once for each unique item (multiple)', () => {
      const set = new Set(['a', 'b', 'c']);
      const cb = spy();
      set.forEach(cb);
      expect(cb.calledThrice).to.be.true;
    });

    it('should call the callback once for each unique item (duplicate)', () => {
      const set = new Set(['a', 'b', 'c', 'c']);
      const cb = spy();
      set.forEach(cb);
      expect(cb.calledThrice).to.be.true;
    });

    it('should call the callback with the item value (single)', () => {
      const set = new Set(['a']);
      const cb = spy();
      set.forEach(cb);
      expect(cb.calledWith('a')).to.be.true;
    });

    it('should call the callback with the item value (multiple)', () => {
      const set = new Set(['a', 'b', 'c']);
      const cb = spy();
      set.forEach(cb);
      expect(cb.calledWith('a')).to.be.true;
      expect(cb.calledWith('b')).to.be.true;
      expect(cb.calledWith('c')).to.be.true;
    });

    it('should call the callback with the item value (duplicate)', () => {
      const set = new Set(['a', 'b', 'c', 'c']);
      const cb = spy();
      set.forEach(cb);
      expect(cb.calledWith('a')).to.be.true;
      expect(cb.calledWith('b')).to.be.true;
      expect(cb.calledWith('c')).to.be.true;
    });
  });

  describe('#has', () => {
    it('should return true if the set contains an item', () => {
      const set = new Set(['a']);
      expect(set.has('a')).to.be.true;
    });

    it('should return false if the set does not contain an item', () => {
      const set = new Set(['a']);
      expect(set.has('b')).to.be.false;
    });
  });

  describe('#keys', () => {
    it('should return an array of entries', () => {
      const arr = ['a', 'b', 'c'];
      const set = new Set(arr);
      expect(set.keys()).to.eql(arr);
    });

    it('should return entries in insertion order', () => {
      const arr = ['a', 'b', 'c'];
      const set = new Set(arr);
      const entries = set.keys();
      entries.forEach((x, index) => {
        expect(x[0]).to.eql(arr[index]);
      });

      const arr2 = ['c', 'b', 'a'];
      const set2 = new Set(arr2);
      const entries2 = set2.keys();
      entries2.forEach((x, index) => {
        expect(x[0]).to.eql(arr2[index]);
      });
    });
  });

  describe('#values', () => {
    it('should return an array of entries', () => {
      const arr = ['a', 'b', 'c'];
      const set = new Set(arr);
      expect(set.values()).to.eql(arr);
    });

    it('should return entries in insertion order', () => {
      const arr = ['a', 'b', 'c'];
      const set = new Set(arr);
      const entries = set.values();
      entries.forEach((x, index) => {
        expect(x[0]).to.eql(arr[index]);
      });

      const arr2 = ['c', 'b', 'a'];
      const set2 = new Set(arr2);
      const entries2 = set2.values();
      entries2.forEach((x, index) => {
        expect(x[0]).to.eql(arr2[index]);
      });
    });
  });
});
