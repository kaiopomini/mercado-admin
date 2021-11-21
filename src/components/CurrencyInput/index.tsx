import { TextField, TextFieldProps } from "@mui/material";
import React, { InputHTMLAttributes } from "react";

import NumberFormat from "react-number-format";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    onChangeInput(value: any): void;
    currentValue?: string | number;
}

type Props = InputProps & TextFieldProps;




export const CurrencyInput: React.FC<Props> = ({
    currentValue,
    onChangeInput,
    ...rest
}: Props) => {
    // Format by the end
    const formatCurrencyByEnd = (value: string): string => {
        if (!Number(value)) return "";

        const amount = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2
        }).format(parseFloat(value) / 100);

        // if (parseFloat(value) / 100 > 100000000) {
        //   const newFloat = parseFloat(`${value}`.substr(0, `${value}`.length - 1));

        //   const newAmount = new Intl.NumberFormat("pt-BR", {
        //     style: "currency",
        //     currency: "BRL",
        //     minimumFractionDigits: 2
        //   }).format(newFloat);
        //   console.log("LimitReach", newFloat, newAmount, value, amount);
        //   return `${newAmount}`;
        // }
        return `${amount}`;
    };

    // const fixCurrentValue = (): number | string => {
    //     console.log(currentValue);
    //     if (!currentValue || !Number(currentValue)) {
    //         return "";
    //     }
    //     return Number(currentValue) * 100;
    // };

    return (

        <NumberFormat
            // @ts-ignore
            size="small"
            allowNegative={false}
            {...rest}
            customInput={TextField}
            format={formatCurrencyByEnd}
            fixedDecimalScale
            decimalScale={2}
            inputMode="numeric"
            displayType="input"
            value={
                !currentValue || !Number(currentValue) ? "" : Number(currentValue) * 100
            }
            // value={String(parseFloat(currentValue + "" ?? "") * 100)}
            isAllowed={values => {
                const { formattedValue, floatValue } = values;
                // @ts-ignore
                return formattedValue === "" || floatValue / 100 <= 10000000000;
            }}
            onValueChange={values => {
                // if (!values.floatValue) {
                //   onChangeInput('');
                //   return;
                // }
                
                onChangeInput((parseFloat(values.value) / 100).toFixed(2));
            }}
        />
    );
};