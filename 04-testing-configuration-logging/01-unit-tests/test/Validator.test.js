const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор строго проверяет типы', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({ age: '20' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор выдает ошибку, если передан неподдерживаемый тип', () => {
      const validator = new Validator({
        city: {
          type: 'function',
        },
        hasCar: {
          type: 'boolean',
        },
        hobby: {
          type: 'object',
        },
      });

      const errors = validator.validate({ city: () => {}, hasCar: true, hobby: [1, 2, 3] });

      expect(errors).to.have.length(3);
      expect(errors[0]).to.have.property('field').and.to.be.equal('city');
      expect(errors[0]).to.have.property('error').and.to.be.equal('function as type is not allowed');
      expect(errors[1]).to.have.property('field').and.to.be.equal('hasCar');
      expect(errors[1]).to.have.property('error').and.to.be.equal('boolean as type is not allowed');
      expect(errors[2]).to.have.property('field').and.to.be.equal('hobby');
      expect(errors[2]).to.have.property('error').and.to.be.equal('object as type is not allowed');
    });

    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({ age: 28 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 28');
    });

    it('валидатор проверяет только валидируемые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
      });

      const errors = validator.validate({ name: 'Joe', age: 17 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 3');
    });

    it('валидатор проверяет только по заданным параметрам', () => {
      const validator = new Validator({
        name: {},
      });

      const errors = validator.validate({ name: 'Mike' });

      expect(errors).to.have.length(0);
    });
  });
});
