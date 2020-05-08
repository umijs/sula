import warn from 'warning';

export default function warning(isValid: boolean, scope: string, message: string): void {
  warn(isValid, `[sula: ${scope}] ${message}`);
}
