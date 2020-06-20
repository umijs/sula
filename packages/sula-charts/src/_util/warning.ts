import warn from 'warning';

export default function warning(isValid: boolean, message: string): void {
  warn(isValid, `[sula-charts] ${message}`);
}
