import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../src/validations/authValidation.js';

// ─── helpers ──────────────────────────────────────────────────────────────────
const validate = (schema, data) => schema.validate(data, { abortEarly: false });
const ok   = (schema, data) => expect(validate(schema, data).error).toBeUndefined();
const fail = (schema, data) => expect(validate(schema, data).error).toBeDefined();

// ─── registerSchema ───────────────────────────────────────────────────────────
describe('registerSchema', () => {
  const schema = registerSchema.body;

  const valid = {
    email: 'user@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
    firstName: 'John',
    lastName: 'Doe',
  };

  it('accepts a complete valid payload', () => ok(schema, valid));

  it('requires email', () =>
    fail(schema, { ...valid, email: undefined }));

  it('rejects a malformed email', () =>
    fail(schema, { ...valid, email: 'not-an-email' }));

  it('requires password of at least 8 characters', () =>
    fail(schema, { ...valid, password: 'Abc1', confirmPassword: 'Abc1' }));

  it('requires at least one uppercase letter in password', () =>
    fail(schema, { ...valid, password: 'password1', confirmPassword: 'password1' }));

  it('requires at least one digit in password', () =>
    fail(schema, { ...valid, password: 'PasswordA', confirmPassword: 'PasswordA' }));

  it('rejects mismatched confirmPassword', () =>
    fail(schema, { ...valid, confirmPassword: 'Different1' }));

  it('requires firstName of at least 2 characters', () =>
    fail(schema, { ...valid, firstName: 'J' }));

  it('requires lastName of at least 2 characters', () =>
    fail(schema, { ...valid, lastName: 'D' }));

  it('rejects firstName longer than 50 characters', () =>
    fail(schema, { ...valid, firstName: 'A'.repeat(51) }));

  it('accepts a valid international phone number', () =>
    ok(schema, { ...valid, phone: '+251912345678' }));

  it('rejects a phone number with invalid format', () =>
    fail(schema, { ...valid, phone: 'not-a-phone-number' }));

  it('allows phone to be omitted', () =>
    ok(schema, { ...valid, phone: undefined }));

  it('requires all mandatory fields', () =>
    fail(schema, {}));
});

// ─── loginSchema ──────────────────────────────────────────────────────────────
describe('loginSchema', () => {
  const schema = loginSchema.body;

  it('accepts valid credentials', () =>
    ok(schema, { email: 'user@example.com', password: 'anyPassword' }));

  it('requires email', () =>
    fail(schema, { password: 'anyPassword' }));

  it('requires password', () =>
    fail(schema, { email: 'user@example.com' }));

  it('rejects a bad email format', () =>
    fail(schema, { email: 'bad', password: 'anyPassword' }));

  it('rejects empty object', () =>
    fail(schema, {}));
});

// ─── refreshTokenSchema ───────────────────────────────────────────────────────
describe('refreshTokenSchema', () => {
  const schema = refreshTokenSchema.body;

  it('accepts a refresh token string', () =>
    ok(schema, { refreshToken: 'some.jwt.token' }));

  it('rejects missing refresh token', () =>
    fail(schema, {}));

  it('rejects empty refresh token', () =>
    fail(schema, { refreshToken: '' }));
});

// ─── forgotPasswordSchema ─────────────────────────────────────────────────────
describe('forgotPasswordSchema', () => {
  const schema = forgotPasswordSchema.body;

  it('accepts a valid email', () =>
    ok(schema, { email: 'user@example.com' }));

  it('rejects a missing email', () =>
    fail(schema, {}));

  it('rejects an invalid email format', () =>
    fail(schema, { email: 'not-email' }));
});

// ─── resetPasswordSchema ──────────────────────────────────────────────────────
describe('resetPasswordSchema', () => {
  const schema = resetPasswordSchema.body;

  const valid = {
    token: 'reset-token-abc',
    password: 'NewPass1',
    confirmPassword: 'NewPass1',
  };

  it('accepts a valid reset payload', () => ok(schema, valid));

  it('requires the reset token', () =>
    fail(schema, { ...valid, token: undefined }));

  it('requires password of at least 8 characters', () =>
    fail(schema, { ...valid, password: 'Sh0rt', confirmPassword: 'Sh0rt' }));

  it('rejects mismatched confirmPassword', () =>
    fail(schema, { ...valid, confirmPassword: 'Different9' }));
});

// ─── changePasswordSchema ─────────────────────────────────────────────────────
describe('changePasswordSchema', () => {
  const schema = changePasswordSchema.body;

  const valid = {
    currentPassword: 'OldPass1',
    newPassword: 'NewPass1',
    confirmPassword: 'NewPass1',
  };

  it('accepts a valid change-password payload', () => ok(schema, valid));

  it('requires currentPassword', () =>
    fail(schema, { ...valid, currentPassword: undefined }));

  it('requires newPassword to meet strength requirements', () =>
    fail(schema, { ...valid, newPassword: 'weak', confirmPassword: 'weak' }));

  it('rejects mismatched confirmPassword', () =>
    fail(schema, { ...valid, confirmPassword: 'Mismatch9' }));

  it('requires confirmPassword', () =>
    fail(schema, { ...valid, confirmPassword: undefined }));
});
