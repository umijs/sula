import numeral from 'numeral';
import { ChartOption } from './interface';
/**
 * var string = numeral(1000).format('0,0');
 * '1,000'
 */
export declare type NormalizedFormat = {
    type?: string;
    label?: string | ((name: string) => string);
    title?: string;
    unit?: string;
};
export declare type Format = string | NormalizedFormat;
declare const formatter: (option: ChartOption) => ChartOption;
export default formatter;
export { numeral };
