const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет строковые поля', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          name: {
            type: 'string', min: 10, max: 20,
          },
        });
      });

      it('корретные данные', () => {
        const errors = validator.validate({
          name: 'длинная строка',
        });

        expect(errors).to.have.length(0);
      });

      describe('невалидные данные', () => {
        it('меньше нижней границы', () => {
          const errors = validator.validate({
            name: 'Lalala',
          });

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('name');
          expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
        });

        it('больше верхней границы', () => {
          const errors = validator.validate({
            name: 'Слишком длинная строка',
          });

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('name');
          expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 22');
        });
      });
    });

    describe('валидатор проверяет числовые поля', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          age: {
            type: 'number', min: 18, max: 27,
          },
        });
      });

      it('корретные данные', () => {
        const errors = validator.validate({
          age: 20,
        });

        expect(errors).to.have.length(0);
      });

      describe('невалидные данные', () => {
        it('меньше нижней границы', () => {
          const errors = validator.validate({
            age: 1,
          });

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 1');
        });

        it('больше верхней границы', () => {
          const errors = validator.validate({
            age: 146,
          });

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 146');
        });
      });
    });

    describe('корректность входных данных', () => {
      it('поле неправильного типа', () => {
        const validator = new Validator({
          name: {
            type: 'string', min: 10, max: 20,
          },
        });

        const errors = validator.validate({
          name: 146,
        });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });

      describe('проверка входных данных', () => {
        let validator;
        beforeEach(() => {
          validator = new Validator({
            name: {
              type: 'string',
              min: 5,
              max: 10,
            },
            age: {
              type: 'number',
              min: 18,
              max: 27,
            },
          });
        });

        it('ключ вызываемого объекта не описан в схеме', () => {
          const errors = validator.validate({
            age: 21,
          });

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('name');
          expect(errors[0]).to.have.property('error').and.to.be.equal('name is required');
        });
      });

      it('значение неподдержимаего типа отдаст необработанное исключение', () => {
        const validator = new Validator({
          isStudent: {
            type: 'boolean',
            min: false,
            max: true,
          },
        });

        const assertFn = () => {
          validator.validate({
            isStudent: true,
          });
        };

        expect(assertFn).to.throw('Unhandled exception');
      });
    });
  });
});
